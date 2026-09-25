import { useState } from "react";
import "./Catering.css";

const cateringPackages = [
  {
    id: "package-5",
    people: 5,
    price: 400,
    title: "CATERING FOR 5",
    description:
      "A simple catering package for small meetings, team lunches or intimate gatherings.",
  },
  {
    id: "package-10",
    people: 10,
    price: 700,
    title: "CATERING FOR 10",
    description:
      "A flexible catering package for office meetings, celebrations and small events.",
  },
  {
    id: "package-20",
    people: 20,
    price: 1200,
    title: "CATERING FOR 20",
    description:
      "A larger catering package for team events, private gatherings and group celebrations.",
  },
];

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const Catering = () => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("idle");

  const openCheckout = (pkg) => {
    setSelectedPackage(pkg);
    setPaymentStatus("review");
  };

  const closeCheckout = () => {
    setSelectedPackage(null);
    setPaymentStatus("idle");
  };

  const simulatePayment = () => {
    setPaymentStatus("processing");

    window.setTimeout(() => {
      setPaymentStatus("success");
    }, 900);
  };

  return (
    <main className="catering-page">
      <section className="catering-hero">
        <p className="catering-eyebrow">BEYOND NATURAL & CO.</p>
        <h1>CATERING</h1>
        <p className="catering-intro">
          Fresh, balanced catering for meetings, celebrations and special events.
        </p>
      </section>

      <section className="catering-shop" aria-labelledby="catering-shop-title">
        <div className="catering-section-heading">
          <p>TEST PACKAGES</p>
          <h2 id="catering-shop-title">CHOOSE YOUR CATERING PACKAGE</h2>
          <span className="catering-test-note">
            TEST MODE — these prices are temporary and no real payment will be charged.
          </span>
        </div>

        <div className="catering-grid">
          {cateringPackages.map((pkg) => (
            <article className="catering-card" key={pkg.id}>
              <div className="catering-card__content">
                <p className="catering-card__people">{pkg.people} PEOPLE</p>
                <h3>{pkg.title}</h3>
                <p>{pkg.description}</p>
                <strong className="catering-card__price">{usd.format(pkg.price)}</strong>
              </div>

              <button
                className="catering-checkout-button"
                type="button"
                onClick={() => openCheckout(pkg)}
              >
                TEST CHECKOUT
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="catering-payment">
        <div>
          <p className="catering-payment__label">SECURE PAYMENT</p>
          <h2>CLOVER CHECKOUT</h2>
          <p>
            The production version will send the selected package to Clover Hosted
            Checkout. This temporary version only simulates the checkout flow so the
            layout and customer experience can be tested safely.
          </p>
        </div>

        <div className="catering-payment__methods" aria-label="Planned payment methods">
          <span>VISA</span>
          <span>MASTERCARD</span>
          <span>AMEX</span>
          <span>APPLE PAY</span>
        </div>
      </section>

      <section className="catering-setup-notice">
        <strong>TEST MODE</strong>
        <span>
          No card details are requested and no charge is created. The next step is to
          connect this checkout to the secure Clover backend.
        </span>
      </section>

      {selectedPackage && (
        <div className="catering-modal-backdrop" role="presentation">
          <section
            className="catering-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="catering-checkout-title"
          >
            {paymentStatus !== "success" ? (
              <>
                <div className="catering-modal__header">
                  <div>
                    <p>CHECKOUT PREVIEW</p>
                    <h2 id="catering-checkout-title">Review your order</h2>
                  </div>
                  <button
                    type="button"
                    className="catering-modal__close"
                    onClick={closeCheckout}
                    aria-label="Close checkout"
                  >
                    ×
                  </button>
                </div>

                <div className="catering-order-summary">
                  <div>
                    <span>Package</span>
                    <strong>{selectedPackage.title}</strong>
                  </div>
                  <div>
                    <span>Guests</span>
                    <strong>{selectedPackage.people}</strong>
                  </div>
                  <div>
                    <span>Total</span>
                    <strong>{usd.format(selectedPackage.price)}</strong>
                  </div>
                </div>

                <div className="catering-test-alert">
                  TEST MODE — clicking below will simulate an approved payment. No
                  card will be charged.
                </div>

                <button
                  type="button"
                  className="catering-modal__pay"
                  onClick={simulatePayment}
                  disabled={paymentStatus === "processing"}
                >
                  {paymentStatus === "processing"
                    ? "PROCESSING..."
                    : `SIMULATE PAYMENT — ${usd.format(selectedPackage.price)}`}
                </button>
              </>
            ) : (
              <div className="catering-success">
                <div className="catering-success__icon">✓</div>
                <p>TEST PAYMENT APPROVED</p>
                <h2>Order confirmed</h2>
                <span>
                  {selectedPackage.title} · {usd.format(selectedPackage.price)}
                </span>
                <button type="button" onClick={closeCheckout}>
                  CLOSE
                </button>
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  );
};

export default Catering;
