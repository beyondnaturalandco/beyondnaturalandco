import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import "./CateringPay.css";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const CateringPay = () => {
  const location = useLocation();
  const [quote, setQuote] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  const apiBaseUrl = useMemo(
    () =>
      (
        import.meta.env.VITE_CLOVER_API_URL ||
        "https://darkgrey-sheep-182422.hostingersite.com"
      ).replace(/\/$/, ""),
    []
  );

  const token = new URLSearchParams(location.search).get("quote");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setError("This catering payment link is incomplete.");
      return;
    }

    const loadQuote = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/quote/preview`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || "Unable to load this quote.");
        }

        setQuote(data.quote);
        setStatus("ready");
      } catch (err) {
        setStatus("error");
        setError(err?.message || "Unable to load this quote.");
      }
    };

    loadQuote();
  }, [apiBaseUrl, token]);

  const payQuote = async () => {
    setStatus("processing");
    setError("");

    try {
      const response = await fetch(`${apiBaseUrl}/api/quote/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (!response.ok || !data?.checkoutUrl) {
        throw new Error(data?.error || "Unable to start Clover checkout.");
      }

      window.location.assign(data.checkoutUrl);
    } catch (err) {
      setStatus("ready");
      setError(err?.message || "Unable to start Clover checkout.");
    }
  };

  return (
    <main className="quote-pay-page">
      <section className="quote-pay-card">
        <p className="quote-pay-eyebrow">BEYOND NATURAL & CO.</p>

        {status === "loading" && <h1>Loading your quote…</h1>}

        {status === "error" && (
          <>
            <h1>Quote unavailable</h1>
            <div className="quote-pay-error">{error}</div>
          </>
        )}

        {quote && status !== "error" && (
          <>
            <h1>YOUR CATERING QUOTE</h1>

            <div className="quote-pay-details">
              <div>
                <span>Quote</span>
                <strong>{quote.id}</strong>
              </div>
              <div>
                <span>Customer</span>
                <strong>
                  {quote.firstName} {quote.lastName}
                </strong>
              </div>
              <div>
                <span>Email</span>
                <strong>{quote.email}</strong>
              </div>
            </div>

            <div className="quote-pay-description">
              <span>ORDER DETAILS</span>
              <p>{quote.description}</p>
            </div>

            <div className="quote-pay-total">
              <span>TOTAL</span>
              <strong>{usd.format(quote.amountCents / 100)}</strong>
            </div>

            {error && <div className="quote-pay-error">{error}</div>}

            <button
              type="button"
              onClick={payQuote}
              disabled={status === "processing"}
              className="quote-pay-button"
            >
              {status === "processing"
                ? "CONNECTING TO CLOVER…"
                : `PAY SECURELY — ${usd.format(quote.amountCents / 100)}`}
            </button>

            <p className="quote-pay-note">
              You will be redirected to Clover to enter your payment information securely.
            </p>
          </>
        )}
      </section>
    </main>
  );
};

export default CateringPay;
