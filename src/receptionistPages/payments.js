// frontend/src/pages/PaymentPage.js
import React, { useEffect, useState } from "react";
import {
  getAllPayments,
  createPayment,
  updatePayment,
  deletePayment,
} from "../services/paymentsService";
import { PlusIcon, PencilIcon } from "@heroicons/react/24/outline";
import Sidebar from "../staffPageComponents/sideBar";

const PaymentPage = () => {
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [notification, setNotification] = useState({ message: "", type: "" });

  const Notification = ({ message, type, onClose }) => {
    if (!message) return null;
    return (
      <div
        className={`fixed top-5 right-5 px-4 py-3 rounded shadow-lg z-50 transition-all duration-300 ${
          type === "success"
            ? "bg-green-600 text-white"
            : "bg-red-600 text-white"
        }`}
      >
        <span>{message}</span>
        <button className="ml-4 font-bold" onClick={onClose}>
          X
        </button>
      </div>
    );
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 3000);
  };

  // Fetch payments
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await getAllPayments();
        setPayments(data.payments || []);
      } catch (err) {
        showNotification("Error fetching payments", "error");
      }
    };
    fetchPayments();
  }, []);

  // Save (Add/Edit) payment
const handleSavePayment = async (paymentData) => {
  try {
    if (selectedPayment) {
      const { payment: updatedPayment } = await updatePayment(
        selectedPayment._id,
        paymentData
      );
      setPayments(
        payments.map((p) =>
          p._id === updatedPayment._id ? updatedPayment : p
        )
      );
      showNotification("Payment updated successfully!", "success");
    } else {
      const { payment: newPayment } = await createPayment(paymentData);
      setPayments([...payments, newPayment]);
      showNotification("Payment added successfully!", "success");
    }
    setShowModal(false);
    setSelectedPayment(null);
  } catch (err) {
    console.error(err); // <-- show full backend error
    showNotification("Error saving payment: " + err.message, "error");
  }
};


  const handleEditPayment = (payment) => {
    setSelectedPayment(payment);
    setShowModal(true);
  };

  const handleNewPayment = () => {
    setSelectedPayment(null);
    setShowModal(true);
  };

  const confirmDeletePayment = (payment) => {
    setPaymentToDelete(payment);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!paymentToDelete) return;
    try {
      await deletePayment(paymentToDelete._id);
      setPayments(payments.filter((p) => p._id !== paymentToDelete._id));
      showNotification("Payment deleted successfully!", "success");
      setShowDeleteModal(false);
      setPaymentToDelete(null);
    } catch (err) {
      showNotification("Error deleting payment", "error");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Paid: "bg-green-900 text-green-300",
      Pending: "bg-yellow-900 text-yellow-300",
      Failed: "bg-red-900 text-red-300",
    };
    return colors[status] || "bg-gray-700 text-gray-300";
  };

  const PaymentCard = ({ payment }) => (
    <div className="bg-neutral-800 rounded-xl shadow-lg p-6 flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-white">Payment</h3>
          <p className="text-sm text-gray-400 font-mono">{payment._id}</p>
        </div>
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
            payment.status
          )}`}
        >
          {payment.status}
        </span>
      </div>

      <div className="space-y-2 mb-4 text-gray-300 text-sm">
        <div className="flex justify-between">
          <span>Amount:</span>
          <span className="font-medium">${payment.amount}</span>
        </div>
      </div>

      <div className="flex justify-between items-center text-xs text-gray-400 mt-auto">
        <div className="space-x-2">
          <button
            className="p-1 text-gray-400 hover:text-gray-200"
            onClick={() => handleEditPayment(payment)}
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          <button
            className="p-1 text-red-500 hover:text-red-400"
            onClick={() => confirmDeletePayment(payment)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  const PaymentModal = ({ payment, onSave, onClose }) => {
    const [form, setForm] = useState(
      payment || { amount: "", status: "Pending" }
    );

    const handleChange = (e) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!form.amount || Number(form.amount) <= 0) {
        showNotification("Enter a valid amount", "error");
        return;
      }
      onSave({ amount: Number(form.amount), status: form.status });
    };

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-neutral-800 p-6 rounded-lg shadow-lg text-white w-96">
          <h3 className="text-lg font-bold mb-4">
            {payment ? "Edit Payment" : "Add Payment"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="Amount"
              className="w-full px-3 py-2 rounded bg-neutral-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded bg-neutral-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option>Pending</option>
              <option>Paid</option>
              <option>Failed</option>
            </select>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-neutral-900 text-white">
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: "", type: "" })}
      />

      <div className="w-64">
        <Sidebar />
      </div>

      <div className="flex-1 p-6 space-y-6 overflow-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Payment Management</h2>
          <button
            onClick={handleNewPayment}
            className="inline-flex items-center px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            Add Payment
          </button>
        </div>

        {payments.length === 0 ? (
          <p className="text-gray-400 mt-6">No payments found</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {payments.map((payment) => (
              <PaymentCard key={payment._id} payment={payment} />
            ))}
          </div>
        )}

        {showModal && (
          <PaymentModal
            payment={selectedPayment}
            onClose={() => {
              setShowModal(false);
              setSelectedPayment(null);
            }}
            onSave={handleSavePayment}
          />
        )}

        {showDeleteModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-neutral-800 p-6 rounded-lg shadow-lg text-white w-96">
              <h3 className="text-lg font-bold mb-4">
                Are you sure you want to delete this payment?
              </h3>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirmed}
                  className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
