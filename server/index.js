import express from "express";
import cors from "cors";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { createCateringNotifications } from "./catering-sms.js";

const app = express();
const port = Number(process.env.PORT || 3000);

const merchantId = process.env.CLOVER_MERCHANT_ID;
const privateToken = process.env.CLOVER_PRIVATE_TOKEN;
const quoteAdminKey = process.env.QUOTE_ADMIN_KEY || "";
const cateringEmailTo =
  process.env.CATERING_EMAIL_TO || "beyondnaturalandco@gmail.com";
const smtpUser = process.env.SMTP_USER || "";
const smtpPass = process.env.SMTP_PASS || "";
const frontendOrigin =
  process.env.FRONTEND_ORIGIN ||
  "https://limegreen-capybara-570366.hostingersite.com";

const allowedOrigins = frontendOrigin
  .split(",")
  .map((value) => value.trim().replace(/\/$/, ""))
  .filter(Boolean);

const isAllowedOrigin = (origin) => {
  if (!origin) return true;

  const normalizedOrigin = origin.replace(/\/$/, "");

  if (allowedOrigins.includes(normalizedOrigin)) return true;

  try {
    const url = new URL(normalizedOrigin);
    const hostname = url.hostname.toLowerCase();

    return (
      url.protocol === "https:" &&
      (
        hostname.endsWith(".hostingersite.com") ||
        hostname === "beyondnaturalandco.com" ||
        hostname === "www.beyondnaturalandco.com"
      )
    );
  } catch {
    return false;
  }
};

const mailTransport =
  smtpUser && smtpPass
    ? nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      })
    : null;

const cateringNotifications = createCateringNotifications();

const escapeHtml = (value) =>
  String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const quoteSecret = crypto
  .createHash("sha256")
  .update(`${quoteAdminKey}:${privateToken || ""}`)
  .digest();

const encodeQuote = (payload) => {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", quoteSecret).update(body).digest("base64url");
  return `${body}.${signature}`;
};

const decodeQuote = (token) => {
  if (!token || typeof token !== "string" || !token.includes(".")) {
    throw new Error("Invalid quote link.");
  }

  const [body, signature] = token.split(".");
  const expected = crypto.createHmac("sha256", quoteSecret).update(body).digest("base64url");

  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    throw new Error("Invalid quote link.");
  }

  const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));

  if (!payload?.exp || Date.now() > payload.exp) {
    throw new Error("This quote link has expired.");
  }

  return payload;
};

const createCloverCheckout = async ({ lineName, note, amountCents, customer, successUrl, failureUrl }) => {
  const payload = {
    customer,
    redirectUrls: {
      success: successUrl,
      failure: failureUrl,
    },
    shoppingCart: {
      lineItems: [
        {
          name: lineName,
          note,
          price: amountCents,
          unitQty: 1,
        },
      ],
    },
  };

  const cloverResponse = await fetch(
    "https://api.clover.com/invoicingcheckoutservice/v1/checkouts",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "User-Agent": "BeyondNaturalCatering/1.0",
        "X-Clover-Merchant-Id": merchantId,
        Authorization: `Bearer ${privateToken}`,
      },
      body: JSON.stringify(payload),
    }
  );

  const responseText = await cloverResponse.text();
  let cloverData = {};

  try {
    cloverData = responseText ? JSON.parse(responseText) : {};
  } catch {
    cloverData = {};
  }

  if (!cloverResponse.ok || !cloverData?.href) {
    console.error("Clover checkout error", {
      status: cloverResponse.status,
      response: responseText.slice(0, 500),
    });

    const cloverMessage =
      cloverData?.message ||
      cloverData?.error?.message ||
      cloverData?.error ||
      cloverData?.detail ||
      cloverData?.description ||
      "";

    const safeMessage =
      typeof cloverMessage === "string"
        ? cloverMessage.replace(/[\r\n\t]+/g, " ").slice(0, 180)
        : "";

    const error = new Error(
      safeMessage
        ? `Clover error ${cloverResponse.status}: ${safeMessage}`
        : `Clover error ${cloverResponse.status}: checkout could not be created.`
    );
    error.status = 502;
    throw error;
  }

  return {
    checkoutUrl: cloverData.href,
    checkoutSessionId: cloverData.checkoutSessionId,
  };
};

app.disable("x-powered-by");
app.use(express.json({ limit: "30kb" }));
app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Origin not allowed"));
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "X-Quote-Admin-Key"],
    optionsSuccessStatus: 204,
  })
);

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    configured: Boolean(merchantId && privateToken),
    merchantConfigured: Boolean(merchantId),
    tokenConfigured: Boolean(privateToken),
    quoteAdminConfigured: Boolean(quoteAdminKey),
    cateringEmailConfigured: Boolean(mailTransport),
    cateringSmsEnabled: cateringNotifications.status.enabled,
    cateringSmsConfigured: cateringNotifications.status.configured,
  });
});

app.post("/api/breakfast-social/checkout", async (req, res) => {
  try {
    if (!merchantId || !privateToken) {
      return res.status(503).json({
        error: "Clover payment service is not configured.",
      });
    }

    const customer = req.body?.customer || {};
    const firstName = String(customer.firstName || "").trim();
    const lastName = String(customer.lastName || "").trim();
    const email = String(customer.email || "").trim().toLowerCase();

    if (!firstName || !lastName || !email.includes("@")) {
      return res.status(400).json({
        error: "First name, last name and a valid email are required.",
      });
    }

    const successUrl = `${allowedOrigins[0]}/#/catering?payment=success`;
    const failureUrl = `${allowedOrigins[0]}/#/catering?payment=failure`;

    const result = await createCloverCheckout({
      lineName: "Breakfast Social",
      note: "Beyond Natural & Co. Breakfast Social catering package",
      amountCents: 25000,
      customer: {
        firstName,
        lastName,
        email,
      },
      successUrl,
      failureUrl,
    });

    return res.json(result);
  } catch (error) {
    console.error("Breakfast Social checkout failed", error);
    return res.status(error.status || 500).json({
      error: error.message || "Unable to create checkout.",
    });
  }
});

app.post("/api/catering-request", async (req, res) => {
  try {
    if (!mailTransport) {
      return res.status(503).json({
        error: "Catering email service is not configured yet.",
      });
    }

    const {
      name,
      phone,
      email,
      eventAddress,
      buyerAddress,
      eventDate,
      guestCount,
      needs,
    } = req.body || {};

    const clean = {
      name: String(name || "").trim().slice(0, 120),
      phone: String(phone || "").trim().slice(0, 50),
      email: String(email || "").trim().toLowerCase().slice(0, 180),
      eventAddress: String(eventAddress || "").trim().slice(0, 300),
      buyerAddress: String(buyerAddress || "").trim().slice(0, 300),
      eventDate: String(eventDate || "").trim().slice(0, 30),
      guestCount: String(guestCount || "").trim().slice(0, 20),
      needs: String(needs || "").trim().slice(0, 4000),
    };

    if (
      !clean.name ||
      !clean.phone ||
      !clean.email.includes("@") ||
      !clean.eventAddress ||
      !clean.buyerAddress ||
      !clean.needs
    ) {
      return res.status(400).json({
        error: "Please complete all required fields.",
      });
    }

    const safe = Object.fromEntries(
      Object.entries(clean).map(([key, value]) => [key, escapeHtml(value)])
    );

    const textBody = [
      "NEW CATERING QUOTE REQUEST",
      "",
      `Name: ${clean.name}`,
      `Phone: ${clean.phone}`,
      `Email: ${clean.email}`,
      `Event address: ${clean.eventAddress}`,
      `Buyer / billing address: ${clean.buyerAddress}`,
      `Event date: ${clean.eventDate || "Not provided"}`,
      `Estimated guests: ${clean.guestCount || "Not provided"}`,
      "",
      "Catering needs:",
      clean.needs,
    ].join("\n");

    await cateringNotifications.sendMailAndNotify(mailTransport, {
      from: `Beyond Natural Website <${smtpUser}>`,
      to: cateringEmailTo,
      replyTo: clean.email,
      subject: `New catering quote request — ${clean.name}`,
      text: textBody,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;color:#222">
          <div style="background:#949b4b;color:#fff;padding:24px 28px;border-radius:18px 18px 0 0">
            <div style="font-size:12px;letter-spacing:1.4px;font-weight:700">BEYOND NATURAL & CO.</div>
            <h1 style="margin:8px 0 0;font-size:26px">New Catering Quote Request</h1>
          </div>
          <div style="border:1px solid #e5e5df;border-top:0;padding:28px;border-radius:0 0 18px 18px">
            <table style="width:100%;border-collapse:collapse">
              <tr><td style="padding:7px 0;color:#777">Name</td><td style="padding:7px 0;font-weight:700">${safe.name}</td></tr>
              <tr><td style="padding:7px 0;color:#777">Phone</td><td style="padding:7px 0">${safe.phone}</td></tr>
              <tr><td style="padding:7px 0;color:#777">Email</td><td style="padding:7px 0">${safe.email}</td></tr>
              <tr><td style="padding:7px 0;color:#777">Event address</td><td style="padding:7px 0">${safe.eventAddress}</td></tr>
              <tr><td style="padding:7px 0;color:#777">Buyer / billing address</td><td style="padding:7px 0">${safe.buyerAddress}</td></tr>
              <tr><td style="padding:7px 0;color:#777">Event date</td><td style="padding:7px 0">${safe.eventDate || "Not provided"}</td></tr>
              <tr><td style="padding:7px 0;color:#777">Estimated guests</td><td style="padding:7px 0">${safe.guestCount || "Not provided"}</td></tr>
            </table>
            <div style="margin-top:22px;padding:18px;background:#f7f8f1;border-radius:12px">
              <div style="font-size:12px;color:#777;font-weight:700;margin-bottom:8px">CATERING NEEDS</div>
              <div style="white-space:pre-wrap;line-height:1.6">${safe.needs}</div>
            </div>
          </div>
        </div>
      `,
    });

    return res.json({ ok: true });
  } catch (error) {
    console.error("Catering request email failed", error);
    return res.status(500).json({
      error: "Unable to send your request right now. Please try again.",
    });
  }
});

app.post("/api/admin/create-quote", (req, res) => {
  try {
    if (!quoteAdminKey) {
      return res.status(503).json({ error: "Quote admin is not configured." });
    }

    if (req.get("X-Quote-Admin-Key") !== quoteAdminKey) {
      return res.status(401).json({ error: "Invalid admin key." });
    }

    const {
      firstName,
      lastName,
      email,
      amount,
      description,
      expiresDays = 7,
    } = req.body || {};

    const cleanFirst = String(firstName || "").trim();
    const cleanLast = String(lastName || "").trim();
    const cleanEmail = String(email || "").trim().toLowerCase();
    const cleanDescription = String(description || "").trim().slice(0, 500);
    const amountNumber = Number(amount);
    const amountCents = Math.round(amountNumber * 100);
    const days = Math.min(30, Math.max(1, Number(expiresDays) || 7));

    if (!cleanFirst || !cleanLast || !cleanEmail.includes("@")) {
      return res.status(400).json({ error: "Valid customer information is required." });
    }

    if (!Number.isFinite(amountNumber) || amountCents < 100 || amountCents > 10000000) {
      return res.status(400).json({ error: "Enter a valid agreed amount." });
    }

    if (!cleanDescription) {
      return res.status(400).json({ error: "Quote description is required." });
    }

    const quoteId =
      "BN-" +
      Date.now().toString(36).toUpperCase() +
      "-" +
      crypto.randomBytes(2).toString("hex").toUpperCase();

    const quote = {
      v: 1,
      id: quoteId,
      firstName: cleanFirst,
      lastName: cleanLast,
      email: cleanEmail,
      amountCents,
      description: cleanDescription,
      exp: Date.now() + days * 24 * 60 * 60 * 1000,
    };

    const token = encodeQuote(quote);
    const payUrl = `${allowedOrigins[0]}/#/catering/pay?quote=${encodeURIComponent(token)}`;

    return res.json({
      quoteId,
      payUrl,
      expiresAt: quote.exp,
    });
  } catch (error) {
    console.error("Create quote failed", error);
    return res.status(500).json({ error: "Unable to create quote." });
  }
});

app.post("/api/quote/preview", (req, res) => {
  try {
    const quote = decodeQuote(req.body?.token);

    return res.json({
      quote: {
        id: quote.id,
        firstName: quote.firstName,
        lastName: quote.lastName,
        email: quote.email,
        amountCents: quote.amountCents,
        description: quote.description,
        expiresAt: quote.exp,
      },
    });
  } catch (error) {
    return res.status(400).json({ error: error.message || "Invalid quote link." });
  }
});

app.post("/api/quote/checkout", async (req, res) => {
  try {
    if (!merchantId || !privateToken) {
      return res.status(503).json({ error: "Clover payment service is not configured." });
    }

    const quote = decodeQuote(req.body?.token);

    const successUrl = `${allowedOrigins[0]}/#/catering?payment=success&quote=${encodeURIComponent(quote.id)}`;
    const failureUrl = `${allowedOrigins[0]}/#/catering?payment=failure&quote=${encodeURIComponent(quote.id)}`;

    const result = await createCloverCheckout({
      lineName: `Custom Catering Quote ${quote.id}`,
      note: quote.description,
      amountCents: quote.amountCents,
      customer: {
        firstName: quote.firstName,
        lastName: quote.lastName,
        email: quote.email,
      },
      successUrl,
      failureUrl,
    });

    return res.json(result);
  } catch (error) {
    console.error("Quote checkout failed", error);
    return res.status(error.status || 400).json({
      error: error.message || "Unable to create checkout.",
    });
  }
});

app.use((err, _req, res, _next) => {
  if (err?.message === "Origin not allowed") {
    return res.status(403).json({ error: "Origin not allowed." });
  }

  console.error(err);
  return res.status(500).json({ error: "Unexpected server error." });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Beyond Natural Clover API listening on port ${port}`);
});
