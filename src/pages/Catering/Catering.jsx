import { useMemo, useState } from "react";
import { food_list } from "../../assets/assets";
import "./Catering.css";

const businessPhone = "+19144264266";

const Catering = () => {
  const [quantities, setQuantities] = useState({});
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    eventDate: "",
    guestCount: "",
    fulfillment: "Pickup",
    address: "",
    notes: "",
  });
  const [message, setMessage] = useState("");

  const selectedItems = useMemo(
    () =>
      food_list
        .map((item) => ({
          id: item._id,
          name: item.name,
          category: item.category,
          quantity: Number(quantities[item._id] || 0),
        }))
        .filter((item) => item.quantity > 0),
    [quantities]
  );

  const totalUnits = selectedItems.reduce((sum, item) => sum + item.quantity, 0);

  const changeQuantity = (itemId, delta) => {
    setQuantities((current) => {
      const next = Math.max(0, Number(current[itemId] || 0) + delta);
      return { ...current, [itemId]: next };
    });
  };

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const requestQuote = (event) => {
    event.preventDefault();
    setMessage("");

    if (!selectedItems.length) {
      setMessage("Please select at least one catering item.");
      return;
    }

    if (!form.firstName || !form.lastName || !form.email || !form.phone) {
      setMessage("Please complete your contact information.");
      return;
    }

    if (!form.eventDate || !form.guestCount) {
      setMessage("Please add the event date and guest count.");
      return;
    }

    if (form.fulfillment === "Delivery" && !form.address.trim()) {
      setMessage("Please add the delivery address.");
      return;
    }

    const productLines = selectedItems
      .map((item) => `• ${item.quantity} × ${item.name}`)
      .join("\n");

    const body = [
      "BEYOND NATURAL & CO. — CATERING QUOTE REQUEST",
      "",
      `Customer: ${form.firstName} ${form.lastName}`,
      `Email: ${form.email}`,
      `Phone: ${form.phone}`,
      `Event date: ${form.eventDate}`,
      `Guests: ${form.guestCount}`,
      `Pickup / Delivery: ${form.fulfillment}`,
      form.fulfillment === "Delivery" ? `Address: ${form.address}` : "",
      "",
      "Requested items:",
      productLines,
      `Total units: ${totalUnits}`,
      "",
      form.notes ? `Notes: ${form.notes}` : "",
      "",
      "Please send me a custom quote.",
    ]
      .filter(Boolean)
      .join("\n");

    const isAppleMobile = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    const separator = isAppleMobile ? "&" : "?";
    window.location.href = `sms:${businessPhone}${separator}body=${encodeURIComponent(body)}`;
  };

  return (
    <main className="catering-page">
      <section className="catering-hero">
        <p className="catering-eyebrow">BEYOND NATURAL & CO.</p>
        <h1>CATERING</h1>
        <p className="catering-intro">
          Build your catering request, choose quantities and event details, and we’ll
          prepare a custom quote for you.
        </p>
      </section>

      <section className="custom-catering" aria-labelledby="custom-catering-title">
        <div className="catering-section-heading">
          <p>BUILD YOUR ORDER</p>
          <h2 id="custom-catering-title">CUSTOM CATERING</h2>
          <span className="catering-test-note">
            No standard package price — your final total is quoted based on your request.
          </span>
        </div>

        <div className="custom-catering-layout">
          <div className="custom-products">
            {food_list.map((item) => {
              const quantity = Number(quantities[item._id] || 0);

              return (
                <article className="custom-product" key={item._id}>
                  <div className="custom-product__content">
                    <span>{item.category}</span>
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                  </div>

                  <div className="quantity-control" aria-label={`Quantity for ${item.name}`}>
                    <button
                      type="button"
                      onClick={() => changeQuantity(item._id, -1)}
                      disabled={quantity === 0}
                      aria-label={`Remove one ${item.name}`}
                    >
                      −
                    </button>
                    <strong>{quantity}</strong>
                    <button
                      type="button"
                      onClick={() => changeQuantity(item._id, 1)}
                      aria-label={`Add one ${item.name}`}
                    >
                      +
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          <aside className="quote-summary">
            <p className="quote-summary__eyebrow">YOUR REQUEST</p>
            <h2>{totalUnits} ITEM{totalUnits === 1 ? "" : "S"}</h2>

            {selectedItems.length ? (
              <div className="quote-summary__items">
                {selectedItems.map((item) => (
                  <div key={item.id}>
                    <span>{item.name}</span>
                    <strong>× {item.quantity}</strong>
                  </div>
                ))}
              </div>
            ) : (
              <p className="quote-summary__empty">
                Add products to start building your catering request.
              </p>
            )}
          </aside>
        </div>

        <form className="quote-request-form" onSubmit={requestQuote}>
          <div className="quote-request-heading">
            <p>EVENT DETAILS</p>
            <h2>Tell us about your event</h2>
          </div>

          <div className="quote-form-grid">
            <label>
              First name
              <input name="firstName" value={form.firstName} onChange={updateField} required />
            </label>
            <label>
              Last name
              <input name="lastName" value={form.lastName} onChange={updateField} required />
            </label>
            <label>
              Email
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={updateField}
                required
              />
            </label>
            <label>
              Phone
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={updateField}
                required
              />
            </label>
            <label>
              Event date
              <input
                type="date"
                name="eventDate"
                value={form.eventDate}
                onChange={updateField}
                required
              />
            </label>
            <label>
              Guest count
              <input
                type="number"
                min="1"
                name="guestCount"
                value={form.guestCount}
                onChange={updateField}
                required
              />
            </label>
            <label>
              Pickup / Delivery
              <select name="fulfillment" value={form.fulfillment} onChange={updateField}>
                <option>Pickup</option>
                <option>Delivery</option>
              </select>
            </label>
            {form.fulfillment === "Delivery" && (
              <label>
                Delivery address
                <input name="address" value={form.address} onChange={updateField} required />
              </label>
            )}
          </div>

          <label className="quote-notes">
            Notes / special requests
            <textarea
              name="notes"
              rows="4"
              value={form.notes}
              onChange={updateField}
              placeholder="Dietary requests, event timing, setup notes, or anything else we should know."
            />
          </label>

          {message && (
            <div className="catering-payment-error" role="alert">
              {message}
            </div>
          )}

          <div className="quote-request-actions">
            <button className="catering-checkout-button" type="submit">
              REQUEST A QUOTE
            </button>
            <a href={`tel:${businessPhone}`} className="quote-call-button">
              CALL US
            </a>
          </div>
        </form>
      </section>

      <section className="agreed-quote">
        <div>
          <p className="catering-payment__label">ALREADY HAVE A QUOTE?</p>
          <h2>PAY YOUR AGREED PRICE</h2>
          <p>
            Once Beyond Natural approves your catering request, we’ll send you a secure
            payment link with the exact agreed amount. You do not need to enter or edit
            the price yourself.
          </p>
        </div>

        <div className="agreed-quote__steps">
          <span>1. REQUEST</span>
          <span>2. APPROVE</span>
          <span>3. PAY WITH CLOVER</span>
        </div>
      </section>

      <section className="catering-setup-notice">
        <strong>SECURE PAYMENT</strong>
        <span>
          Approved catering quotes are paid through Clover Hosted Checkout. Card
          information is entered directly on Clover’s secure payment page.
        </span>
      </section>
    </main>
  );
};

export default Catering;
