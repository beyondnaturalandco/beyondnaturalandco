import { useMemo, useState } from "react";
import { cateringMenuSections } from "../../data/cateringMenu";
import "./Catering.css";

const businessPhone = "+19144264266";

const Catering = () => {
  const [quantities, setQuantities] = useState({});
  const [customizations, setCustomizations] = useState({});
  const [customizingItem, setCustomizingItem] = useState(null);
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

  const flatMenu = useMemo(
    () =>
      cateringMenuSections.flatMap((section) =>
        section.items.map((item) => ({
          ...item,
          category: section.title,
        }))
      ),
    []
  );

  const selectedItems = useMemo(
    () =>
      flatMenu
        .map((item) => ({
          id: item.id,
          name: item.name,
          meta: item.meta || "",
          category: item.category,
          quantity: Number(quantities[item.id] || 0),
          customization: customizations[item.id] || {},
          customizationSchema: item.customization || null,
        }))
        .filter((item) => item.quantity > 0),
    [flatMenu, quantities, customizations]
  );

  const totalUnits = selectedItems.reduce((sum, item) => sum + item.quantity, 0);

  const changeQuantity = (itemId, delta) => {
    setQuantities((current) => {
      const next = Math.max(0, Number(current[itemId] || 0) + delta);
      return { ...current, [itemId]: next };
    });
  };

  const openCustomizer = (item) => {
    setQuantities((current) => ({
      ...current,
      [item.id]: Math.max(1, Number(current[item.id] || 0)),
    }));
    setCustomizingItem(item);
    setMessage("");
  };

  const toggleCustomization = (itemId, groupKey, group, option) => {
    setCustomizations((current) => {
      const itemConfig = current[itemId] || {};

      if (group.type === "single") {
        return {
          ...current,
          [itemId]: {
            ...itemConfig,
            [groupKey]: option,
          },
        };
      }

      const existing = Array.isArray(itemConfig[groupKey]) ? itemConfig[groupKey] : [];
      const isSelected = existing.includes(option);

      if (isSelected) {
        return {
          ...current,
          [itemId]: {
            ...itemConfig,
            [groupKey]: existing.filter((value) => value !== option),
          },
        };
      }

      if (group.max && existing.length >= group.max) {
        return current;
      }

      return {
        ...current,
        [itemId]: {
          ...itemConfig,
          [groupKey]: [...existing, option],
        },
      };
    });
  };

  const customizationSummary = (item) => {
    if (!item.customizationSchema) return "";

    const config = customizations[item.id] || {};

    return Object.entries(item.customizationSchema)
      .map(([groupKey, group]) => {
        const value = config[groupKey];
        const selected = Array.isArray(value) ? value : value ? [value] : [];
        return selected.length ? `${group.label.replace(/^Choose[^:]*:?/i, "").trim() || groupKey}: ${selected.join(", ")}` : "";
      })
      .filter(Boolean)
      .join(" · ");
  };

  const validateCustomization = (item) => {
    if (!item.customizationSchema) return true;

    const config = customizations[item.id] || {};

    return Object.entries(item.customizationSchema).every(([groupKey, group]) => {
      const required = group.label.toLowerCase().startsWith("choose");
      if (!required) return true;

      const value = config[groupKey];
      if (Array.isArray(value)) return value.length > 0;
      return Boolean(value);
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

    const incompleteCustomItem = selectedItems.find((item) => !validateCustomization(item));

    if (incompleteCustomItem) {
      setMessage(`Please complete the selections for ${incompleteCustomItem.name}.`);
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
      .map((item) => {
        const label = item.meta ? `${item.name} (${item.meta})` : item.name;
        const optionLines = item.customizationSchema
          ? Object.entries(item.customizationSchema)
              .map(([groupKey, group]) => {
                const value = item.customization[groupKey];
                const selected = Array.isArray(value) ? value : value ? [value] : [];
                return selected.length ? `   - ${group.label}: ${selected.join(", ")}` : "";
              })
              .filter(Boolean)
              .join("\n")
          : "";

        return [
          `• ${item.quantity} × ${label} — ${item.category}`,
          optionLines,
        ]
          .filter(Boolean)
          .join("\n");
      })
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
          Build your catering request with items from our current menu. Choose quantities
          and event details, and we’ll prepare a custom quote for you.
        </p>
      </section>

      <section className="custom-catering" aria-labelledby="custom-catering-title">
        <div className="catering-section-heading">
          <p>BUILD YOUR ORDER</p>
          <h2 id="custom-catering-title">CUSTOM CATERING</h2>
          <span className="catering-test-note">
            No standard catering price — your final total is quoted based on your request.
          </span>
        </div>

        <div className="custom-catering-layout">
          <div className="custom-menu-groups">
            {cateringMenuSections.map((section) => (
              <details className="custom-menu-category" key={section.id}>
                <summary>
                  <div>
                    <span>{section.items.length} OPTIONS</span>
                    <h3>{section.title}</h3>
                    <p>{section.description}</p>
                  </div>
                  <strong className="category-toggle">+</strong>
                </summary>

                <div className="custom-products">
                  {section.items.map((item) => {
                    const quantity = Number(quantities[item.id] || 0);
                    const summary = customizationSummary(item);

                    return (
                      <article className="custom-product" key={item.id}>
                        <div className="custom-product__content">
                          <div className="custom-product__meta-row">
                            <span>{section.title}</span>
                            {item.meta && <em>{item.meta}</em>}
                            {item.customization && <em>CUSTOMIZABLE</em>}
                          </div>
                          <h3>{item.name}</h3>
                          <p>{item.description}</p>

                          {summary && (
                            <div className="custom-product__selection">
                              {summary}
                            </div>
                          )}
                        </div>

                        <div className="custom-product__actions">
                          <div
                            className="quantity-control"
                            aria-label={`Quantity for ${item.name}`}
                          >
                            <button
                              type="button"
                              onClick={() => changeQuantity(item.id, -1)}
                              disabled={quantity === 0}
                              aria-label={`Remove one ${item.name}`}
                            >
                              −
                            </button>
                            <strong>{quantity}</strong>
                            <button
                              type="button"
                              onClick={() => changeQuantity(item.id, 1)}
                              aria-label={`Add one ${item.name}`}
                            >
                              +
                            </button>
                          </div>

                          {item.customization && (
                            <button
                              type="button"
                              className="customize-button"
                              onClick={() => openCustomizer(item)}
                            >
                              {summary ? "EDIT OPTIONS" : "CHOOSE OPTIONS"}
                            </button>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </details>
            ))}
          </div>

          <aside className="quote-summary">
            <p className="quote-summary__eyebrow">YOUR REQUEST</p>
            <h2>{totalUnits} ITEM{totalUnits === 1 ? "" : "S"}</h2>

            {selectedItems.length ? (
              <div className="quote-summary__items">
                {selectedItems.map((item) => (
                  <div className="quote-summary__item" key={item.id}>
                    <div>
                      <span>
                        {item.name}
                        {item.meta ? ` · ${item.meta}` : ""}
                      </span>
                      {item.customizationSchema && (
                        <small>{customizationSummary(item) || "Options not selected yet"}</small>
                      )}
                    </div>
                    <strong>× {item.quantity}</strong>
                  </div>
                ))}
              </div>
            ) : (
              <p className="quote-summary__empty">
                Open a category and add products to start building your catering request.
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

      {customizingItem && (
        <div className="option-modal-backdrop">
          <section
            className="option-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="customize-title"
          >
            <div className="option-modal__header">
              <div>
                <p>CUSTOMIZE</p>
                <h2 id="customize-title">
                  {customizingItem.name}
                  {customizingItem.meta ? ` · ${customizingItem.meta}` : ""}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setCustomizingItem(null)}
                aria-label="Close customization"
              >
                ×
              </button>
            </div>

            <div className="option-groups">
              {Object.entries(customizingItem.customization || {}).map(
                ([groupKey, group]) => {
                  const currentValue = customizations[customizingItem.id]?.[groupKey];
                  const selectedValues = Array.isArray(currentValue)
                    ? currentValue
                    : currentValue
                    ? [currentValue]
                    : [];

                  return (
                    <fieldset className="option-group" key={groupKey}>
                      <legend>
                        {group.label}
                        {group.max && group.type !== "single" && (
                          <small> Max {group.max}</small>
                        )}
                      </legend>

                      <div className="option-grid">
                        {group.options.map((option) => {
                          const selected = selectedValues.includes(option);

                          return (
                            <label
                              className={`option-choice ${selected ? "selected" : ""}`}
                              key={option}
                            >
                              <input
                                type={group.type === "single" ? "radio" : "checkbox"}
                                name={`${customizingItem.id}-${groupKey}`}
                                checked={selected}
                                onChange={() =>
                                  toggleCustomization(
                                    customizingItem.id,
                                    groupKey,
                                    group,
                                    option
                                  )
                                }
                              />
                              <span>{option}</span>
                            </label>
                          );
                        })}
                      </div>
                    </fieldset>
                  );
                }
              )}
            </div>

            <button
              type="button"
              className="option-modal__done"
              onClick={() => setCustomizingItem(null)}
            >
              DONE
            </button>
          </section>
        </div>
      )}
    </main>
  );
};

export default Catering;
