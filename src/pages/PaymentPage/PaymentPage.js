// Chathu Akki
import React, { useEffect, useState } from "react";
import {
  getAllPayments,
  createPayment,
  updatePayment,
  deletePayment,
} from "../../services/paymentsService";

export default function PaymentPage() {
  const [payments, setPayments] = useState([]);
  const [form, setForm] = useState({ amount: "", status: "Pending" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Load payments
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getAllPayments();
        setPayments(data.payments || []);
      } catch (e) {
        console.error(e);
        setError("Failed to load payments.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const amountNum = Number(form.amount);
    if (!amountNum || amountNum <= 0) {
      setError("Enter valid amount");
      return;
    }

    try {
      setSubmitting(true);
      if (editingId) {
        await updatePayment(editingId, {
          amount: amountNum,
          status: form.status,
        });
      } else {
        await createPayment({ amount: amountNum, status: form.status });
      }
      const refreshed = await getAllPayments();
      setPayments(refreshed.payments || []);
      setEditingId(null);
      setForm({ amount: "", status: "Pending" });
    } catch (e) {
      console.error(e);
      setError(editingId ? "Failed to update payment." : "Failed to create payment.");
    } finally {
      setSubmitting(false);
    }
  }

  function startEdit(item) {
    setEditingId(item._id);
    setForm({ amount: String(item.amount), status: item.status });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this payment?")) return;
    try {
      await deletePayment(id);
      const refreshed = await getAllPayments();
      setPayments(refreshed.payments || []);
    } catch (e) {
      console.error(e);
      setError("Failed to delete payment.");
    }
  }

  function cancelEdit() {
    setEditingId(null);
    setForm({ amount: "", status: "Pending" });
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Payment Management
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-wrap items-center gap-3 mb-6"
        >
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="Amount"
            className="flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
          >
            <option>Pending</option>
            <option>Paid</option>
            <option>Failed</option>
          </select>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? "Saving..." : editingId ? "Update" : "Add Payment"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : (
            <table className="w-full text-sm text-left border">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="px-4 py-2 border">ID</th>
                  <th className="px-4 py-2 border">Amount</th>
                  <th className="px-4 py-2 border">Status</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(!payments || payments.length === 0) && (
                  <tr>
                    <td colSpan="4" className="px-4 py-3 text-center text-gray-500">
                      No payments found
                    </td>
                  </tr>
                )}
                {payments.map((p) => (
                  <tr
                    key={p._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-2 border font-mono">{p._id}</td>
                    <td className="px-4 py-2 border">${p.amount}</td>
                    <td
                      className={`px-4 py-2 border font-medium ${
                        p.status === "Paid"
                          ? "text-green-600"
                          : p.status === "Failed"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {p.status}
                    </td>
                    <td className="px-4 py-2 border flex gap-2">
                      <button
                        onClick={() => startEdit(p)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
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
