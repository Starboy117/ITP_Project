import React, { useEffect, useState } from "react";
import { getAllInquiries, updateInquiry, deleteInquiry } from "../../services/inquiriesService";
import "./InquiryPage.css";

export default function AdminInquiryPage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadInquiries();
  }, []);

  const loadInquiries = async () => {
    try {
      setLoading(true);
      const data = await getAllInquiries();
      setInquiries(data.inquiries || []);
    } catch (e) {
      console.error(e);
      setError(e.message || "Failed to load inquiries.");
    } finally {
      setLoading(false);
    }
  };

  function startEdit(item) {
    setEditingId(item._id || item.id);
    setForm({ name: item.name, email: item.email, message: item.message });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleUpdate(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name || !form.email || !form.message) {
      setError("Please complete all fields.");
      return;
    }

    try {
      await updateInquiry(editingId, form);
      setEditingId(null);
      setForm({ name: "", email: "", message: "" });
      setSuccess("Inquiry updated successfully!");
      await loadInquiries();
    } catch (e) {
      console.error(e);
      setError(e.message || "Failed to update inquiry.");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this inquiry?")) return;

    try {
      await deleteInquiry(id);
      setSuccess("Inquiry deleted successfully!");
      await loadInquiries();
    } catch (e) {
      console.error(e);
      setError(e.message || "Failed to delete inquiry.");
    }
  }

  return (
    <div className="inquiry-page">
      <div className="page-card">
        <h2>Admin: Manage Inquiries</h2>
        {error && <div className="error-box">{error}</div>}
        {success && <div className="success-box">{success}</div>}

        {editingId && (
          <form className="inquiry-form" onSubmit={handleUpdate}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <input className="input" name="name" value={form.name} onChange={handleChange} placeholder="Name" />
              <input className="input" name="email" value={form.email} onChange={handleChange} placeholder="Email" type="email" />
            </div>

            <textarea
              className="input"
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Message"
              rows="4"
              style={{ marginTop: 10 }}
            />

            <div style={{ marginTop: 10 }}>
              <button type="submit" className="btn primary">Update</button>
              <button type="button" className="btn ghost" style={{ marginLeft: 8 }} onClick={() => setEditingId(null)}>Cancel</button>
            </div>
          </form>
        )}

        <div style={{ marginTop: 20 }}>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="table inquiries">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Message</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.length === 0 && <tr><td colSpan="5">No inquiries found</td></tr>}
                {inquiries.map((i) => (
                  <tr key={i._id || i.id}>
                    <td>{i._id || i.id}</td>
                    <td>{i.name}</td>
                    <td>{i.email}</td>
                    <td style={{ maxWidth: 420, whiteSpace: "pre-wrap" }}>{i.message}</td>
                    <td className="actions">
                      <button className="btn" onClick={() => startEdit(i)}>Edit</button>
                      <button className="btn ghost" onClick={() => handleDelete(i._id || i.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
