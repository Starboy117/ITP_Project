const BASE_URL = "http://localhost:5000/api/inquiries"; 

// Helper to parse response safely
async function parse(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { _raw: text };
  }
}

// ✅ Get all inquiries
export async function getAllInquiries() {
  const res = await fetch(BASE_URL);
  const data = await parse(res);
  if (!res.ok) throw new Error(data?.message || "Failed to load inquiries");
  return data; // { inquiries: [...] }
}

// ✅ Create a new inquiry
export async function createInquiry(inquiry) {
  const res = await fetch(`${BASE_URL}/addInquiry`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(inquiry),
  });
  const data = await parse(res);
  if (!res.ok) throw new Error(data?.message || "Failed to create inquiry");
  return data; // { inquiry: {...} }
}


// ✅ Update inquiry by ID
export async function updateInquiry(id, inquiry) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(inquiry),
  });
  const data = await parse(res);
  if (!res.ok) throw new Error(data?.message || "Failed to update inquiry");
  return data; // { inquiry: {...} }
}

// ✅ Delete inquiry by ID
export async function deleteInquiry(id) {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  const data = await parse(res);
  if (!res.ok) throw new Error(data?.message || "Failed to delete inquiry");
  return data; // { message: "..." }
}
