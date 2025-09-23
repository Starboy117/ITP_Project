import React, { useState } from "react";
import { createInquiry } from "../../services/inquiriesService";
import "./InquiryPage.css";

export default function UserInquiryPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const name = form.name.trim();
    const email = form.email.trim();
    const message = form.message.trim();

    if (!name || !email || !message) {
      setError("Please complete all fields.");
      return;
    }

    try {
      setSubmitting(true);
      await createInquiry({ name, email, message });
      setSuccess("Your inquiry has been submitted successfully!");
      setForm({ name: "", email: "", message: "" });
    } catch (e) {
      console.error(e);
      setError(e.message || "Failed to submit inquiry.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="inquiry-page">
      <div className="page-card">
        <h2>Submit Your Inquiry</h2>
        {error && <div className="error-box">{error}</div>}
        {success && <div className="success-box">{success}</div>}

        <form className="inquiry-form" onSubmit={handleSubmit}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <input className="input" name="name" value={form.name} onChange={handleChange} placeholder="Name" />
            <input className="input" name="email" value={form.email} onChange={handleChange} placeholder="Email" type="email" />
          </div>

          <textarea
            className="input"
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Your inquiry"
            rows="4"
            style={{ marginTop: 10 }}
          />

          <button type="submit" className="btn primary" disabled={submitting} style={{ marginTop: 10 }}>
            {submitting ? "Submitting..." : "Submit Inquiry"}
          </button>
        </form>
      </div>
    </div>
  );
}
