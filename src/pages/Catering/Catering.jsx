import { useMemo, useState } from "react";
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
  const [paymentError, setPaymentError] = useState("");
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

  const openCheckout = (pkg) => {
    setSelectedPackage(pkg);
    setPaymentStatus("review");
    setPaymentError("");
  };

  const closeCheckout = () => {
    if (paymentStatus === "processing") return;
    setSelectedPackage(null);
    setPaymentStatus("idle");
    setPaymentError("");
  };

  const updateCustomer = (event) => {
    const { name, value } = event.target;
    setCustomer((current) => ({ ...current, [name]: value }));
  };

  const startRealPayment = async (event) => {
    event.preventDefault();
    if (!selectedPackage) return;

    if (!apiBaseUrl) {
      setPaymentError(
        "The secure Clover payment server is not configured yet. Please contact Beyond Natural & Co."
      );
      return;
    }

    setPaymentStatus("processing");
    setPaymentError("");

    try {
      const response = await fetch(`${apiBaseUrl}/api/create-checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          packageId: selectedPackage.id,
          customer,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data?.checkoutUrl) {
        throw new Error(data?.error || "Unable to start Clover checkout.");
      }

      window.location.assign(data.checkoutUrl);
    } catch (error) {
      setPaymentStatus("review");
      setPaymentError(
        error?.message || "Unable to connect to Clover. Please try again."
      );
    }
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
          <p>CATERING PACKAGES</p>
          <h2 id="catering-shop-title">CHOOSE YOUR CATERING PACKAGE</h2>
          <span className="catering-test-note">
            Temporary package pricing — final menu details can be adjusted with the client.
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
                SECURE CHECKOUT
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
            Payments are completed on Clover's secure Hosted Checkout. Beyond Natural
            & Co. does not store card numbers on this website.
          </p>
        </div>

        <div className="catering-payment__methods" aria-label="Accepted payment methods">
          <span>VISA</span>
          <span>MASTERCARD</span>
          <span>AMEX</span>
          <span>APPLE PAY</span>
        </div>
      </section>

      <section className="catering-setup-notice">
        <strong>SECURE CHECKOUT</strong>
        <span>
          You will be redirected to Clover to complete payment. The selected package
          price is validated securely on our server before checkout is created.
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
            <div className="catering-modal__header">
              <div>
                <p>SECURE CLOVER CHECKOUT</p>
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

            <form className="catering-customer-form" onSubmit={startRealPayment}>
              <div className="catering-form-row">
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

              {paymentError && (
                <div className="catering-payment-error" role="alert">
                  {paymentError}
                </div>
              )}

              <button
                type="submit"
                className="catering-modal__pay"
                disabled={paymentStatus === "processing"}
              >
                {paymentStatus === "processing"
                  ? "CONNECTING TO CLOVER..."
                  : `PAY SECURELY — ${usd.format(selectedPackage.price)}`}
              </button>
            </form>

            <p className="catering-secure-note">
              Card information is entered directly on Clover's secure payment page.
            </p>
          </section>
        </div>
      )}
    </main>
  );
};

export default Catering;
