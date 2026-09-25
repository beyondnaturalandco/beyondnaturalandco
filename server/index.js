import express from "express";
import cors from "cors";
import crypto from "crypto";

const app = express();
const port = Number(process.env.PORT || 3000);

const merchantId = process.env.CLOVER_MERCHANT_ID;
const privateToken = process.env.CLOVER_PRIVATE_TOKEN;
const quoteAdminKey = process.env.QUOTE_ADMIN_KEY || "";
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
  });
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
