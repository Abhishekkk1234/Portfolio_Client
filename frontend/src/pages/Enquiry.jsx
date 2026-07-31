import React, { useEffect, useState } from "react";
import { getCollections, submitEnquiry } from "../api/client";

const EMPTY = { name: "", email: "", phone: "", subject: "", message: "", collection_of_interest: "" };

export default function Enquiry() {
  const [collections, setCollections] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState({ state: "idle", message: "" });

  useEffect(() => {
    getCollections().then(setCollections).catch(() => setCollections([]));
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus({ state: "sending", message: "" });
    try {
      const payload = { ...form };
      if (!payload.collection_of_interest) delete payload.collection_of_interest;
      await submitEnquiry(payload);
      setStatus({ state: "ok", message: "Thank you — your enquiry has been sent. We'll reply by email shortly." });
      setForm(EMPTY);
    } catch (err) {
      setStatus({
        state: "err",
        message: "Something went wrong sending that. Please check the fields and try again.",
      });
    }
  };

  return (
    <section className="wrap enquiry-grid">
      <div>
        <span className="eyebrow">Enquiry</span>
        <h1 style={{ fontSize: "clamp(34px,4.4vw,54px)" }}>Get in touch</h1>
        <p style={{ color: "var(--grey)", marginTop: 18, maxWidth: "40ch" }}>
          For bespoke commissions, stockist enquiries, or press requests —
          tell us a little about what you're looking for and we'll respond
          directly.
        </p>
      </div>

      <form onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" value={form.name} onChange={onChange} required />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" name="email" value={form.email} onChange={onChange} required />
        </div>
        <div className="field">
          <label htmlFor="phone">Phone (optional)</label>
          <input id="phone" name="phone" value={form.phone} onChange={onChange} />
        </div>
        <div className="field">
          <label htmlFor="collection_of_interest">Collection of interest (optional)</label>
          <select
            id="collection_of_interest"
            name="collection_of_interest"
            value={form.collection_of_interest}
            onChange={onChange}
          >
            <option value="">— None in particular —</option>
            {collections.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="subject">Subject</label>
          <input id="subject" name="subject" value={form.subject} onChange={onChange} />
        </div>
        <div className="field">
          <label htmlFor="message">Message</label>
          <textarea id="message" name="message" value={form.message} onChange={onChange} required />
        </div>

        <button type="submit" className="btn btn-solid" disabled={status.state === "sending"}>
          {status.state === "sending" ? "Sending…" : "Send Enquiry"}
        </button>

        {status.message && (
          <p className={`form-note ${status.state === "ok" ? "ok" : "err"}`}>{status.message}</p>
        )}
      </form>
    </section>
  );
}
