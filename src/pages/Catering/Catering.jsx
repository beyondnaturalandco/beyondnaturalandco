import { useMemo, useState } from "react";
import "./Catering.css";

const PACKAGE_PRICE = 250;

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const Catering = () => {
  const [showCheckout, setShowCheckout] = useState(false);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [customer, setCustomer] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const apiBaseUrl = useMemo(
    () =>
      (
        import.meta.env.VITE_CLOVER_API_URL ||
        "https://darkgrey-sheep-182422.hostingersite.com"
      ).replace(/\/$/, ""),
    []
  );

  const updateCustomer = (event) => {
    const { name, value } = event.target;
    setCustomer((current) => ({ ...current, [name]: value }));
  };

  const closeCheckout = () => {
    if (status === "processing") return;
    setShowCheckout(false);
    setError("");
    setStatus("idle");
  };

  const startPayment = async (event) => {
    event.preventDefault();
    setStatus("processing");
    setError("");

    try {
      const response = await fetch(`${apiBaseUrl}/api/breakfast-social/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ customer }),
      });

      const data = await response.json();

      if (!response.ok || !data?.checkoutUrl) {
        throw new Error(data?.error || "Unable to start Clover checkout.");
      }

      window.location.assign(data.checkoutUrl);
    } catch (err) {
      setStatus("idle");
      setError(err?.message || "Unable to connect to Clover. Please try again.");
    }
  };

  return (
    <main className="catering-page">
      <section className="breakfast-social-hero">
        <p className="breakfast-social-eyebrow">BEYOND NATURAL & CO. CATERING</p>
        <h1>BREAKFAST SOCIAL</h1>
        <p className="breakfast-social-copy">
          Complete breakfast catering package.
        </p>

        <div className="breakfast-social-price">{usd.format(PACKAGE_PRICE)}</div>

        <button
          type="button"
          className="breakfast-social-button"
          onClick={() => setShowCheckout(true)}
        >
          BREAKFAST SOCIAL — {usd.format(PACKAGE_PRICE)}
        </button>

        <p className="breakfast-social-secure">
          Secure payment powered by Clover.
        </p>
      </section>

      {showCheckout && (
        <div className="breakfast-modal-backdrop" role="presentation">
          <section
            className="breakfast-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="breakfast-checkout-title"
          >
            <div className="breakfast-modal-header">
              <div>
                <p>SECURE CLOVER CHECKOUT</p>
                <h2 id="breakfast-checkout-title">Breakfast Social</h2>
              </div>
              <button
                type="button"
                className="breakfast-modal-close"
                onClick={closeCheckout}
                aria-label="Close checkout"
              >
                ×
              </button>
            </div>

            <div className="breakfast-order-summary">
              <span>Package</span>
              <strong>BREAKFAST SOCIAL</strong>
              <span>Total</span>
              <strong>{usd.format(PACKAGE_PRICE)}</strong>
            </div>

            <form className="breakfast-customer-form" onSubmit={startPayment}>
              <div className="breakfast-name-grid">
                <label>
                  First name
                  <input
                    type="text"
                    name="firstName"
                    value={customer.firstName}
                    onChange={updateCustomer}
                    autoComplete="given-name"
                    required
                  />
                </label>

                <label>
                  Last name
                  <input
                    type="text"
                    name="lastName"
                    value={customer.lastName}
                    onChange={updateCustomer}
                    autoComplete="family-name"
                    required
                  />
                </label>
              </div>

              <label>
                Email
                <input
                  type="email"
                  name="email"
                  value={customer.email}
                  onChange={updateCustomer}
                  autoComplete="email"
                  required
                />
              </label>

              {error && (
                <div className="breakfast-payment-error" role="alert">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="breakfast-pay-button"
                disabled={status === "processing"}
              >
                {status === "processing"
                  ? "CONNECTING TO CLOVER..."
                  : `PAY SECURELY — ${usd.format(PACKAGE_PRICE)}`}
              </button>
            </form>

            <p className="breakfast-modal-note">
              Card information is entered directly on Clover's secure payment page.
            </p>
          </section>
        </div>
      )}
    </main>
  );
};

export default Catering;
