import { createHash } from "node:crypto";

const SMS_BODY = "Beyond Natural & Co.: New catering quote request. Please check beyondnaturalandco@gmail.com. Reply STOP to unsubscribe.";
const E164 = /^\+[1-9]\d{7,14}$/;
const HOUR = 60 * 60 * 1000;
const DEDUPE_WINDOW = 5 * 60 * 1000;

/** Server-only SMS alerts. No customer data or browser-provided recipients. */
export function createCateringNotifications({
  env = process.env,
  fetchImpl = globalThis.fetch,
  logger = console,
  now = Date.now,
} = {}) {
  const value = (key) => String(env[key] || "").trim();
  const enabled = value("CATERING_SMS_ENABLED").toLowerCase() === "true";
  const accountSid = value("TWILIO_ACCOUNT_SID");
  const authToken = value("TWILIO_AUTH_TOKEN");
  const from = value("TWILIO_FROM_NUMBER");
  const messagingServiceSid = value("TWILIO_MESSAGING_SERVICE_SID");
  const recipients = [...new Set(value("CATERING_SMS_TO").split(",").map((s) => s.trim()).filter(Boolean))];
  const configured = Boolean(
    /^AC[0-9a-f]{32}$/i.test(accountSid) && authToken &&
    (messagingServiceSid ? /^MG[0-9a-f]{32}$/i.test(messagingServiceSid) : E164.test(from)) &&
    recipients.length > 0 && recipients.length <= 2 && recipients.every((to) => E164.test(to))
  );
  const requestedLimit = Number(value("CATERING_SMS_MAX_PER_HOUR") || 60);
  const maxPerHour = Number.isInteger(requestedLimit) && requestedLimit >= 2 && requestedLimit <= 200
    ? requestedLimit : 60;
  const recent = new Map();
  let attempts = [];

  // Never let a logger or an SMS-provider failure change the email outcome.
  const log = (level, details) => {
    try { logger[level]?.("Catering SMS", details); } catch { /* Email remains primary. */ }
  };

  const sendOne = async (to) => {
    const body = new URLSearchParams({ To: to, Body: SMS_BODY });
    if (messagingServiceSid) body.set("MessagingServiceSid", messagingServiceSid);
    else body.set("From", from);
    const response = await fetchImpl(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: body.toString(),
        redirect: "error",
        signal: AbortSignal.timeout(8000),
      }
    );
    const data = await response.json();
    if (!response.ok || !/^SM[0-9a-f]{32}$/i.test(data?.sid || "") ||
        !["accepted", "queued", "sending", "sent", "delivered"].includes(data?.status)) {
      const error = new Error("SMS provider did not accept the notification.");
      error.httpStatus = response.status;
      // Keep provider codes for diagnosis, never the response body or secrets.
      error.providerCode = Number.isInteger(data?.code) ? data.code : null;
      throw error;
    }
    return { messageSid: data.sid, status: data.status };
  };

  const notify = async (mailOptions) => {
    if (!enabled || !configured) {
      log("warn", { reason: enabled ? "configuration_missing_or_invalid" : "disabled" });
      return;
    }
    const timestamp = now();
    for (const [key, expiresAt] of recent) {
      if (expiresAt <= timestamp) recent.delete(key);
    }
    const fingerprint = createHash("sha256")
      .update(JSON.stringify([mailOptions.to, mailOptions.subject, mailOptions.text]))
      .digest("hex");
    if (recent.has(fingerprint)) {
      log("info", { reason: "duplicate_within_five_minutes" });
      return;
    }
    attempts = attempts.filter((time) => timestamp - time < HOUR);
    if (attempts.length + recipients.length > maxPerHour) {
      log("warn", { reason: "hourly_safety_limit", limit: maxPerHour });
      return;
    }
    // Reserve before awaiting, so simultaneous submissions cannot exceed the cap.
    recent.set(fingerprint, timestamp + DEDUPE_WINDOW);
    attempts.push(...recipients.map(() => timestamp));
    const results = await Promise.allSettled(recipients.map(sendOne));
    results.forEach((result, index) => {
      const recipient = `***${recipients[index].slice(-4)}`;
      if (result.status === "fulfilled") {
        // An API acceptance is not a handset-delivery receipt.
        log("info", { recipient, ...result.value });
      } else {
        log("warn", {
          recipient,
          reason: "sms_not_confirmed",
          httpStatus: result.reason?.httpStatus || null,
          providerCode: result.reason?.providerCode || null,
        });
      }
    });
  };

  return {
    status: Object.freeze({ enabled, configured }),
    /** Trigger only after SMTP accepts the form email; this does not monitor Gmail. */
    async sendMailAndNotify(mailTransport, mailOptions) {
      const emailResult = await mailTransport.sendMail(mailOptions);
      if (!Array.isArray(emailResult?.accepted) || emailResult.accepted.length === 0) {
        throw new Error("The mail server did not accept the catering email.");
      }
      try { await notify(mailOptions); }
      catch { log("warn", { reason: "sms_not_confirmed" }); }
      // SMS failures must not invite a customer to resubmit a successful email.
      return emailResult;
    },
  };
}
