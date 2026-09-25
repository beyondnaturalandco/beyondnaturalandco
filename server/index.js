import express from "express";
import cors from "cors";

const app = express();
const port = Number(process.env.PORT || 3000);

const merchantId = process.env.CLOVER_MERCHANT_ID;
const privateToken = process.env.CLOVER_PRIVATE_TOKEN;
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

const packages = {
  "package-5": {
    name: "Beyond Natural Catering for 5",
    price: 40000,
    people: 5,
  },
  "package-10": {
    name: "Beyond Natural Catering for 10",
    price: 70000,
    people: 10,
  },
  "package-20": {
    name: "Beyond Natural Catering for 20",
    price: 120000,
    people: 20,
  },
};

app.disable("x-powered-by");
app.use(express.json({ limit: "20kb" }));
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
    allowedHeaders: ["Content-Type"],
    optionsSuccessStatus: 204,
  })
);

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    configured: Boolean(merchantId && privateToken),
    merchantConfigured: Boolean(merchantId),
    tokenConfigured: Boolean(privateToken),
  });
});

app.post("/api/create-checkout", async (req, res) => {
  try {
    if (!merchantId || !privateToken) {
      return res.status(503).json({
        error: "Clover payment service is not configured.",
      });
    }

    const { packageId, customer } = req.body || {};
    const selectedPackage = packages[packageId];

    if (!selectedPackage) {
      return res.status(400).json({ error: "Invalid catering package." });
    }

    const firstName = String(customer?.firstName || "").trim();
    const lastName = String(customer?.lastName || "").trim();
    const email = String(customer?.email || "").trim().toLowerCase();

    if (!firstName || !lastName || !email || !email.includes("@")) {
      return res.status(400).json({
        error: "First name, last name and a valid email are required.",
      });
    }

    const successUrl = `${allowedOrigins[0]}/#/catering?payment=success`;
    const failureUrl = `${allowedOrigins[0]}/#/catering?payment=failure`;

    const payload = {
      customer: {
        firstName,
        lastName,
        email,
      },
      redirectUrls: {
        success: successUrl,
        failure: failureUrl,
      },
      shoppingCart: {
        lineItems: [
          {
            name: selectedPackage.name,
            note: `${selectedPackage.people} guest catering package`,
            price: selectedPackage.price,
            unitQty: 1,
          },
        ],
      },
    };

    const cloverResponse = await fetch(
      "https://scl.clover.com/invoicingcheckoutservice/v1/checkouts",
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

      return res.status(502).json({
        error: safeMessage
          ? `Clover error ${cloverResponse.status}: ${safeMessage}`
          : `Clover error ${cloverResponse.status}: checkout could not be created.`,
        cloverStatus: cloverResponse.status,
      });
    }

    return res.json({
      checkoutUrl: cloverData.href,
      checkoutSessionId: cloverData.checkoutSessionId,
    });
  } catch (error) {
    console.error("Create checkout failed", error);
    return res.status(500).json({
      error: "Unable to create checkout right now.",
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
