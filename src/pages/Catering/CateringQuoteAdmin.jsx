import { useMemo, useState } from "react";
import "./CateringQuoteAdmin.css";

const CateringQuoteAdmin = () => {
  const [form, setForm] = useState({
    adminKey: "",
    firstName: "",
    lastName: "",
    email: "",
    amount: "",
    description: "",
    expiresDays: "7",
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("idle");

  const apiBaseUrl = useMemo(
    () =>
      (
        import.meta.env.VITE_CLOVER_API_URL ||
        "https://darkgrey-sheep-182422.hostingersite.com"
      ).replace(/\/$/, ""),
    []
  );

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const createQuote = async (event) => {
    event.preventDefault();
    setStatus("working");
    setError("");
    setResult(null);

    try {
      const response = await fetch(`${apiBaseUrl}/api/admin/create-quote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Quote-Admin-Key": form.adminKey,
        },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          amount: form.amount,
          description: form.description,
          expiresDays: Number(form.expiresDays),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Unable to create quote.");
      }

      setResult(data);
      setStatus("done");
    } catch (err) {
      setStatus("idle");
      setError(err?.message || "Unable to create quote.");
    }
  };

  const copyLink = async () => {
    if (!result?.payUrl) return;
    await navigator.clipboard.writeText(result.payUrl);
  };

  return (
    <main className="quote-admin-page">
      <section className="quote-admin-card">
        <p className="quote-admin-eyebrow">INTERNAL TOOL</p>
        <h1>Create catering payment link</h1>
        <p className="quote-admin-intro">
          Enter the final agreed amount. The customer will receive a signed link and
          cannot change the price.
        </p>

        <form onSubmit={createQuote}>
          <label>
            Admin key
            <input
              type="password"
              name="adminKey"
              value={form.adminKey}
              onChange={updateField}
              required
            />
          </label>

          <div className="quote-admin-grid">
            <label>
              First name
              <input name="firstName" value={form.firstName} onChange={updateField} required />
            </label>
            <label>
              Last name
              <input name="lastName" value={form.lastName} onChange={updateField} required />
            </label>
          </div>

          <label>
            Customer email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={updateField}
              required
            />
          </label>

          <label>
            Agreed amount (USD)
            <input
              type="number"
              min="1"
              step="0.01"
              name="amount"
              value={form.amount}
              onChange={updateField}
              required
            />
          </label>

          <label>
            Quote / order description
            <textarea
              name="description"
              rows="5"
              maxLength="500"
              value={form.description}
              onChange={updateField}
              required
            />
          </label>

          <label>
            Link expires in
            <select name="expiresDays" value={form.expiresDays} onChange={updateField}>
              <option value="1">1 day</option>
              <option value="3">3 days</option>
              <option value="7">7 days</option>
              <option value="14">14 days</option>
              <option value="30">30 days</option>
            </select>
          </label>

          {error && <div className="quote-admin-error">{error}</div>}

          <button type="submit" disabled={status === "working"}>
            {status === "working" ? "CREATING…" : "CREATE PAYMENT LINK"}
          </button>
        </form>

        {result?.payUrl && (
          <div className="quote-admin-result">
            <span>QUOTE {result.quoteId}</span>
            <input readOnly value={result.payUrl} />
            <button type="button" onClick={copyLink}>COPY LINK</button>
          </div>
        )}
      </section>
    </main>
  );
};

export default CateringQuoteAdmin;
