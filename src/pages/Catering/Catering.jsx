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
  const [inquiryStatus, setInquiryStatus] = useState("idle");
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [inquiry, setInquiry] = useState({
    name: "",
    phone: "",
    email: "",
    eventAddress: "",
    buyerAddress: "",
    eventDate: "",
    guestCount: "",
    needs: "",
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

  const updateInquiry = (event) => {
    const { name, value } = event.target;
    setInquiry((current) => ({ ...current, [name]: value }));
  };

  const submitInquiry = async (event) => {
    event.preventDefault();
    setInquiryStatus("sending");
    setInquiryMessage("");

    try {
      const response = await fetch(`${apiBaseUrl}/api/catering-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inquiry),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Unable to send your request.");
      }

      setInquiryStatus("sent");
      setInquiryMessage(
        "Thank you. Your catering request has been sent to Beyond Natural & Co."
      );
      setInquiry({
        name: "",
        phone: "",
        email: "",
        eventAddress: "",
        buyerAddress: "",
        eventDate: "",
        guestCount: "",
        needs: "",
      });
    } catch (err) {
      setInquiryStatus("error");
      setInquiryMessage(
        err?.message || "Unable to send your request. Please try again."
      );
    }
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

      <section className="catering-quote-section" aria-labelledby="custom-catering-title">
        <div className="catering-quote-intro">
          <p className="catering-quote-eyebrow">CUSTOM CATERING</p>
          <h2 id="custom-catering-title">Tell us what you need.</h2>
          <p>
            Planning something different? Send us the details of your event and
            we’ll help you build a catering option that fits your needs. Our team
            will review your request and follow up with a personalized quote.
          </p>
          <div className="catering-quote-note">
            <strong>Need help planning?</strong>
            <span>
              Share your event details, guest count, location, and any special
              requests. We’ll take it from there.
            </span>
          </div>
        </div>

        <form className="catering-quote-form" onSubmit={submitInquiry}>
          <div className="catering-form-grid">
            <label>
              Your name
              <input
                type="text"
                name="name"
                value={inquiry.name}
                onChange={updateInquiry}
                autoComplete="name"
                required
              />
            </label>

            <label>
              Phone number
              <input
                type="tel"
                name="phone"
                value={inquiry.phone}
                onChange={updateInquiry}
                autoComplete="tel"
                required
              />
            </label>
          </div>

          <label>
            Email address
            <input
              type="email"
              name="email"
              value={inquiry.email}
              onChange={updateInquiry}
              autoComplete="email"
              required
            />
          </label>

          <label>
            Event address
            <input
              type="text"
              name="eventAddress"
              value={inquiry.eventAddress}
              onChange={updateInquiry}
              autoComplete="street-address"
              placeholder="Where will the event take place?"
              required
            />
          </label>

          <label>
            Buyer / billing address
            <input
              type="text"
              name="buyerAddress"
              value={inquiry.buyerAddress}
              onChange={updateInquiry}
              placeholder="Address of the person or company placing the order"
              required
            />
          </label>

          <div className="catering-form-grid">
            <label>
              Event date
              <input
                type="date"
                name="eventDate"
                value={inquiry.eventDate}
                onChange={updateInquiry}
              />
            </label>

            <label>
              Estimated guests
              <input
                type="number"
                min="1"
                max="5000"
                name="guestCount"
                value={inquiry.guestCount}
                onChange={updateInquiry}
                inputMode="numeric"
                placeholder="e.g. 25"
              />
            </label>
          </div>

          <label>
            Tell us about your catering needs
            <textarea
              name="needs"
              value={inquiry.needs}
              onChange={updateInquiry}
              rows="6"
              placeholder="Menu ideas, dietary needs, preferred service style, timing, budget range, or anything else we should know."
              required
            />
          </label>

          {inquiryMessage && (
            <div
              className={`catering-inquiry-message ${inquiryStatus}`}
              role={inquiryStatus === "error" ? "alert" : "status"}
            >
              {inquiryMessage}
            </div>
          )}

          <button
            type="submit"
            className="catering-quote-submit"
            disabled={inquiryStatus === "sending"}
          >
            {inquiryStatus === "sending" ? "SENDING..." : "REQUEST A QUOTE"}
          </button>

          <p className="catering-privacy-note">
            Your information is used only to prepare and follow up on your catering request.
          </p>
        </form>
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
