import "./Catering.css";

const cateringOptions = [
  {
    title: "CORPORATE CATERING",
    description:
      "Fresh catering for offices, meetings and team events. Choose your menu, guest count and service details.",
  },
  {
    title: "PRIVATE EVENTS",
    description:
      "Flexible catering for celebrations, gatherings and private events with customized food selections.",
  },
  {
    title: "CUSTOM CATERING",
    description:
      "Need something specific? Build a custom catering request based on your event, guest count and menu needs.",
  },
];

const Catering = () => {
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
          <p>ORDER ONLINE</p>
          <h2 id="catering-shop-title">CHOOSE YOUR CATERING OPTION</h2>
        </div>

        <div className="catering-grid">
          {cateringOptions.map((option) => (
            <article className="catering-card" key={option.title}>
              <div className="catering-card__content">
                <h3>{option.title}</h3>
                <p>{option.description}</p>
              </div>

              <button
                className="catering-checkout-button"
                type="button"
                disabled
                aria-disabled="true"
                title="Secure checkout will be enabled after Stripe is connected."
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
          <h2>PAY BY CARD OR APPLE PAY</h2>
          <p>
            Checkout will be processed securely through Stripe. Beyond Natural & Co.
            will not store card numbers on this website.
          </p>
        </div>

        <div className="catering-payment__methods" aria-label="Available payment methods">
          <span>VISA</span>
          <span>MASTERCARD</span>
          <span>AMEX</span>
          <span>APPLE PAY</span>
        </div>
      </section>

      <section className="catering-setup-notice">
        <strong>PAYMENT SETUP IN PROGRESS</strong>
        <span>
          Product prices and secure Stripe checkout links will be activated once the
          business Stripe account is connected.
        </span>
      </section>
    </main>
  );
};

export default Catering;
