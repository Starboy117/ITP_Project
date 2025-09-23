const BASE_URL = "http://localhost:5000/api/payments"; // <-- your backend URL

// Get all payments
export async function getAllPayments() {
  const res = await fetch(BASE_URL);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch payments");
  return data; // { payments: [...] }
}

// Create new payment
export async function createPayment(payment) {
  const res = await fetch(`${BASE_URL}/addPayment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payment),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create payment");
  return data; // { payment: {...} }
}

// Update payment by ID
export async function updatePayment(id, patch) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update payment");
  return data; // { payment: {...} }
}

// Delete payment by ID
export async function deletePayment(id) {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete payment");
  return data; // { message: "..." }
}
