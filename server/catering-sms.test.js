import test from "node:test";
import assert from "node:assert/strict";
import { createCateringNotifications } from "./catering-sms.js";

// Dummy credentials and fixture recipients. All network calls are mocked.
const env = {
  CATERING_SMS_ENABLED: "true",
  TWILIO_ACCOUNT_SID: "AC" + "a".repeat(32),
  TWILIO_AUTH_TOKEN: "test-only-secret",
  TWILIO_FROM_NUMBER: "+15005550006",
  CATERING_SMS_TO: "+15005550007,+15005550008",
};
const options = {
  to: "catering@example.com", subject: "Catering request", text: "Private event details",
};
const accepted = { accepted: ["catering@example.com"], messageId: "test-message" };
const mail = { sendMail: async () => accepted };
const good = () => ({ ok: true, status: 201, json: async () => ({ sid: "SM" + "b".repeat(32), status: "queued" }) });
function fixture(overrides = {}, handler = async () => good(), now) {
  const calls = [], logs = [];
  const notifier = createCateringNotifications({
    env: { ...env, ...overrides },
    fetchImpl: async (...args) => { calls.push(args); return handler(...args); },
    logger: { info: (...args) => logs.push(args), warn: (...args) => logs.push(args) },
    ...(now ? { now } : {}),
  });
  return { notifier, calls, logs };
}

test("SMS is opt-in and does not alter email when disabled", async () => {
  const { notifier, calls } = fixture({ CATERING_SMS_ENABLED: "false" });
  assert.equal(await notifier.sendMailAndNotify(mail, options), accepted);
  assert.equal(calls.length, 0);
});
test("missing or invalid configuration never triggers an SMS", async () => {
  for (const missing of [{TWILIO_AUTH_TOKEN:""}, {CATERING_SMS_TO:"invalid"}, {TWILIO_FROM_NUMBER:""}]) {
    const { notifier, calls } = fixture(missing);
    assert.equal(notifier.status.configured, false);
    await notifier.sendMailAndNotify(mail, options);
    assert.equal(calls.length, 0);
  }
});
test("SMTP failure prevents all SMS attempts", async () => {
  const { notifier, calls } = fixture();
  await assert.rejects(notifier.sendMailAndNotify({ sendMail: async () => { throw new Error("SMTP unavailable"); } }, options));
  assert.equal(calls.length, 0);
});
test("no accepted email recipient is not reported as success", async () => {
  const { notifier, calls } = fixture();
  await assert.rejects(notifier.sendMailAndNotify({ sendMail: async () => ({ accepted: [] }) }, options));
  assert.equal(calls.length, 0);
});
test("each recipient gets one independent notice after email acceptance", async () => {
  let mailAccepted = false;
  const { notifier, calls, logs } = fixture({}, async () => { assert.equal(mailAccepted, true); return good(); });
  await notifier.sendMailAndNotify({ sendMail: async () => { mailAccepted = true; return accepted; } }, options);
  assert.equal(calls.length, 2);
  assert.deepEqual(calls.map(([, req]) => new URLSearchParams(req.body).get("To")), env.CATERING_SMS_TO.split(","));
  for (const [url, req] of calls) {
    assert.equal(url, `https://api.twilio.com/2010-04-01/Accounts/${env.TWILIO_ACCOUNT_SID}/Messages.json`);
    assert.equal(req.method, "POST");
    assert.equal(req.redirect, "error");
    assert.ok(req.signal instanceof AbortSignal);
    const body = new URLSearchParams(req.body);
    assert.equal(body.get("From"), env.TWILIO_FROM_NUMBER);
    assert.match(body.get("Body"), /Please check beyondnaturalandco@gmail.com/);
    assert.equal(body.get("Body").includes(options.text), false);
    assert.ok(body.get("Body").length <= 160);
  }
  assert.equal(JSON.stringify(logs).includes(env.TWILIO_AUTH_TOKEN), false);
  assert.equal(JSON.stringify(logs).includes("+15005550007"), false);
});
test("one failed SMS does not prevent the other or invalidate the email", async () => {
  const { notifier, calls } = fixture({}, async (_url, req) => {
    if (new URLSearchParams(req.body).get("To").endsWith("007")) throw new Error("network failure");
    return good();
  });
  assert.equal(await notifier.sendMailAndNotify(mail, options), accepted);
  assert.equal(calls.length, 2);
});
test("HTTP rejection is logged safely without retries or failing the form", async () => {
  const { notifier, calls, logs } = fixture({}, async () => ({ ok: false, status: 400, json: async () => ({ code:21610, message:"sensitive provider details" }) }));
  assert.equal(await notifier.sendMailAndNotify(mail, options), accepted);
  assert.equal(calls.length, 2);
  assert.ok(logs.some(([, details]) => details.providerCode === 21610));
  assert.equal(JSON.stringify(logs).includes("sensitive provider details"), false);
});
test("supports a Messaging Service instead of a From number", async () => {
  const service = "MG" + "c".repeat(32);
  const { notifier, calls } = fixture({ TWILIO_FROM_NUMBER: "", TWILIO_MESSAGING_SERVICE_SID: service });
  await notifier.sendMailAndNotify(mail, options);
  const body = new URLSearchParams(calls[0][1].body);
  assert.equal(body.get("MessagingServiceSid"), service);
  assert.equal(body.has("From"), false);
});
test("identical requests are SMS-deduplicated for five minutes", async () => {
  let clock = 1000000;
  const { notifier, calls } = fixture({}, undefined, () => clock);
  await Promise.all([notifier.sendMailAndNotify(mail, options), notifier.sendMailAndNotify(mail, options)]);
  assert.equal(calls.length, 2);
  clock += 300001;
  await notifier.sendMailAndNotify(mail, options);
  assert.equal(calls.length, 4);
});
test("hourly cost guard does not block emails and resets after one hour", async () => {
  let clock = 1000000;
  const { notifier, calls } = fixture({ CATERING_SMS_MAX_PER_HOUR: "2" }, undefined, () => clock);
  await notifier.sendMailAndNotify(mail, options);
  assert.equal(await notifier.sendMailAndNotify(mail, { ...options, text: "Another event" }), accepted);
  assert.equal(calls.length, 2);
  clock += 3600001;
  await notifier.sendMailAndNotify(mail, { ...options, text: "Third event" });
  assert.equal(calls.length, 4);
});
test("recipient duplicates are removed and more than two recipients are rejected", async () => {
  const one = fixture({ CATERING_SMS_TO: "+15005550007,+15005550007" });
  await one.notifier.sendMailAndNotify(mail, options);
  assert.equal(one.calls.length, 1);
  const three = fixture({ CATERING_SMS_TO: "+15005550007,+15005550008,+15005550009" });
  await three.notifier.sendMailAndNotify(mail, options);
  assert.equal(three.calls.length, 0);
});
test("provider timeout or malformed response cannot turn a sent email into failure", async () => {
  for (const handler of [async () => { throw new DOMException("Timeout", "TimeoutError"); }, async () => ({ ok:true,status:201,json:async()=>{ throw new SyntaxError("invalid json"); } })]) {
    const { notifier, calls } = fixture({}, handler);
    assert.equal(await notifier.sendMailAndNotify(mail, options), accepted);
    assert.equal(calls.length, 2);
  }
});
