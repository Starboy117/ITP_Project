import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import Navbar from "../HomeComponents/Navbar";
import CopyrightFooter from "../BookingAvailableComponents/CopyrightFooter";
import { useAuth } from "../context/AuthContext";

import visaIcon from "../Images/visa.png";
import mastercardIcon from "../Images/mastercard.png";

const stripePromise = loadStripe(
  "pk_test_51SBc07Rztq4m6G9LcuW4q2DcAj652L10raNsYy5vFiOwCjxhB6izmxzn78gjscq0m6oa1SFivvJYYQLvocg4NP18005GDKwtAe"
);

const CheckoutForm = ({ booking, currentUser }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [email, setEmail] = React.useState(booking.email || "");
  const [cardName, setCardName] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState({});
  const [cardBrand, setCardBrand] = React.useState("");

  const cardStyle = {
    style: {
      base: {
        fontSize: "16px",
        color: "#fff",
        "::placeholder": { color: "#aaa" },
        fontFamily: "Inter, sans-serif",
      },
      invalid: { color: "#ff4d4f" },
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!email.trim()) newErrors.email = "Email is required.";
    if (!cardName.trim()) newErrors.cardName = "Cardholder name is required.";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!stripe || !elements) return setErrors({ general: "Stripe not loaded." });

    const cardNumber = elements.getElement(CardNumberElement);
    if (!cardNumber) return setErrors({ general: "Card element not ready." });

    if (cardBrand !== "visa" && cardBrand !== "mastercard")
      return setErrors({ general: "Only Visa & MasterCard accepted." });

    setErrors({});
    setLoading(true);

    try {
      let bookingId = booking.bookingId;

      // 🔹 Step 1: Create booking first if not exists (today/tomorrow bookings)
      if (!bookingId) {
        const [startTime, endTime] = booking.slot.split(" - ");
        const res = await fetch("http://localhost:5000/api/reservations/addBookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            userId: currentUser._id,
            name: booking.name,
            phone: booking.phone,
            email: booking.email,
            courtName: booking.courtName,
            courtType: booking.courtType,
            date: booking.date,
            startTime,
            endTime,
            courtPrice: booking.courtPrice,
            slot: booking.slot,
          }),
        });

        const addResult = await res.json();
        
        if (!res.ok) throw new Error(addResult.error || "Booking creation failed");
        bookingId = addResult.bookingId;
        
      }

      // 🔹 Step 2: Create PaymentIntent with real bookingId
      const response = await fetch("http://localhost:5000/api/payments/addPayment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          amount: booking.courtPrice,
          currency: "lkr",
          userId: currentUser._id,
        }),
      });

      const result = await response.json();
      if (!result.clientSecret) throw new Error("No clientSecret returned from backend!");

      // 🔹 Step 3: Confirm card payment
      const paymentResult = await stripe.confirmCardPayment(result.clientSecret, {
        payment_method: { card: cardNumber, billing_details: { email, name: cardName } },
      });

      if (paymentResult.error) {
        setErrors({ general: paymentResult.error.message });
        return;
      }

      // 🔹 Step 4: Confirm booking in DB
      await fetch(`http://localhost:5000/api/reservations/confirmBooking/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      // 🔹 Step 5: Save booking info for success page
      const finalBooking = { ...booking, bookingId, status: "Confirmed", paymentSuccess: true };
      localStorage.setItem("latestBooking", JSON.stringify(finalBooking));

      // 🔹 Step 6: Redirect
      navigate("/payment-success", { state: finalBooking });
    } catch (err) {
      console.error("Payment failed:", err);
      setErrors({ general: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="flex gap-6 justify-center mb-6">
        <img
          src={visaIcon}
          alt="Visa"
          className={`w-16 h-16 md:w-20 md:h-20 ${cardBrand === "visa" ? "opacity-100" : "opacity-30"}`}
        />
        <img
          src={mastercardIcon}
          alt="MasterCard"
          className={`w-16 h-16 md:w-20 md:h-20 ${cardBrand === "mastercard" ? "opacity-100" : "opacity-30"}`}
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className={`w-full p-3 rounded-lg bg-gray-900 border ${errors.email ? "border-red-500" : "border-gray-700"} focus:outline-none focus:ring-2 focus:ring-[#00D9A6]`}
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>

      <div>
        <label className="block mb-1 font-medium">Cardholder Name</label>
        <input
          type="text"
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
          placeholder="Enter name on card"
          className={`w-full p-3 rounded-lg bg-gray-900 border ${errors.cardName ? "border-red-500" : "border-gray-700"} focus:outline-none focus:ring-2 focus:ring-[#00D9A6]`}
        />
        {errors.cardName && <p className="text-red-500 text-sm mt-1">{errors.cardName}</p>}
      </div>

      <div>
        <label className="block mb-1 font-medium">Card Number</label>
        <div className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700">
          <CardNumberElement options={cardStyle} onChange={(e) => setCardBrand(e.brand)} />
        </div>
      </div>

      <div>
        <label className="block mb-1 font-medium">Expiry Date</label>
        <div className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700">
          <CardExpiryElement options={cardStyle} />
        </div>
      </div>

      <div>
        <label className="block mb-1 font-medium">CVC</label>
        <div className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700">
          <CardCvcElement options={cardStyle} />
        </div>
      </div>

      {errors.general && <p className="text-red-500 text-center">{errors.general}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-gradient-to-r from-[#00D9A6] to-[#0097B2] rounded-lg text-white font-semibold shadow-md hover:opacity-90 transition"
      >
        {loading ? "Processing..." : `Pay LKR ${booking.courtPrice}`}
      </button>
    </form>
  );
};

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const booking = location.state || {};

  console.log(booking);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login", { replace: true });
      return;
    }
    if (!booking.courtName) navigate("/available", { replace: true });
  }, [booking, currentUser, navigate]);

  if (!currentUser) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-6 sm:px-12 lg:px-24 mt-20">
        <div className="grid lg:grid-cols-2 gap-10 w-full max-w-6xl">
          <div className="bg-neutral-800 rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-2">
              Booking Summary
            </h2>
            <ul className="space-y-4 text-lg">
              <li className="flex justify-between">
                <span>Court:</span>
                <span className="font-semibold">{booking.courtName}</span>
              </li>
              <li className="flex justify-between">
                <span>Date:</span>
                <span className="font-semibold">{new Date(booking.date).toLocaleDateString()}</span>
              </li>
              <li className="flex justify-between">
                <span>Time Slot:</span>
                <span className="font-semibold">{booking.slot}</span>
              </li>
              <li className="flex justify-between text-xl pt-2 border-t border-gray-700">
                <span>Total Price:</span>
                <span className="font-bold text-[#00D9A6]">LKR {booking.courtPrice}</span>
              </li>
            </ul>
          </div>

          <div className="bg-neutral-800 rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-2">
              Payment Details
            </h2>
            <Elements stripe={stripePromise}>
              <CheckoutForm booking={booking} currentUser={currentUser} />
            </Elements>
          </div>
        </div>
      </div>
      <footer className="p-4 mt-12">
        <CopyrightFooter />
      </footer>
    </div>
  );
};

export default PaymentPage;
