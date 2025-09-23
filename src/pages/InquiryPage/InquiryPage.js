import React, { useState } from "react";
import Navbar from "../../HomeComponents/Navbar";
import CopyrightFooter from "../../BookingAvailableComponents/CopyrightFooter";
import { createInquiry } from "../../services/inquiriesService";

export default function UserInquiryPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
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
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-900 text-white">
      <Navbar />

      <div className="flex-1 px-6 sm:px-12 lg:px-24 mt-28">
        <h1 className="text-3xl font-bold text-center mb-10">
          Submit Your Inquiry
        </h1>

        <div className="max-w-2xl mx-auto bg-neutral-800 rounded-2xl shadow-lg p-8">
          {error && (
            <div className="bg-red-700 text-white px-4 py-2 rounded mb-4 text-center">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-700 text-white px-4 py-2 rounded mb-4 text-center">
              {success}
            </div>
          )}

          <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-2 font-semibold">Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#0097B2]"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#0097B2]"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold">Message</label>
              <textarea
                placeholder="Your inquiry"
                name="message"
                value={form.message}
                onChange={handleChange}
                rows="5"
                className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#0097B2]"
              />
            </div>

            <div className="text-center mt-4">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-[#0097B2] rounded-lg text-white font-semibold shadow-md hover:bg-[#007A8F] transition"
              >
                {submitting ? "Submitting..." : "Submit Inquiry"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <footer className="p-4 mt-12">
        <CopyrightFooter />
      </footer>
    </div>
  );
}
