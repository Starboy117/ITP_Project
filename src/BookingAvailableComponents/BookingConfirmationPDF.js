import React from "react";
import { Page, Text, View, Document, StyleSheet, Font } from "@react-pdf/renderer";

// Optional: register a custom font
Font.register({
  family: "Roboto",
  fonts: [
    { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf" },
    { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf", fontWeight: "bold" },
    { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf", fontWeight: "light" },
  ],
});

// Styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    padding: 30,
    fontFamily: "Roboto",
    position: "relative",
  },
  header: {
    backgroundColor: "#0097B2",
    color: "#fff",
    padding: 20,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 25,
    borderRadius: 8,
    borderBottom: "10px solid #007A8F",
  },
  section: {
    marginBottom: 15,
    backgroundColor: "#f8fdff",
    padding: 20,
    borderRadius: 8,
    border: "1px solid #e1f5fe",
  },
  fieldContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingVertical: 6,
    borderBottom: "1px solid #f0f0f0",
  },
  fieldLabel: {
    fontWeight: "bold",
    color: "#007A8F",
    fontSize: 12,
    width: "30%",
  },
  fieldValue: {
    fontSize: 12,
    width: "65%",
    color: "#333333",
  },
  statusPending: {
    color: "#dc2626",
    fontWeight: "bold",
    fontSize: 12,
    backgroundColor: "#fef2f2",
    padding: "4px 8px",
    borderRadius: 4,
  },
  statusConfirmed: {
    color: "#059669",
    fontWeight: "bold",
    fontSize: 12,
    backgroundColor: "#f0fdf4",
    padding: "4px 8px",
    borderRadius: 4,
  },
  watermark: {
    position: "absolute",
    fontSize: 80,
    color: "#0097B2",
    opacity: 0.03,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%) rotate(-45deg)",
  },
  warning: {
    marginTop: 25,
    marginBottom: 15,
    color: "#b91c1c",
    fontWeight: "bold",
    fontSize: 12,
    backgroundColor: "#fef2f2",
    padding: 15,
    borderRadius: 6,
    border: "1px solid #fecaca",
    textAlign: "center",
  },
  successMessage: {
    marginTop: 25,
    marginBottom: 15,
    color: "#059669",
    fontWeight: "bold",
    fontSize: 12,
    backgroundColor: "#f0fdf4",
    padding: 15,
    borderRadius: 6,
    border: "1px solid #a7f3d0",
    textAlign: "center",
  },
  footer: {
    marginTop: 30,
    fontSize: 11,
    textAlign: "center",
    color: "#666666",
    padding: 15,
    backgroundColor: "#f9fafb",
    borderRadius: 6,
    fontWeight: "light",
  },
  infoBox: {
    backgroundColor: "#f0f9ff",
    border: "1px solid #bae6fd",
    borderRadius: 6,
    padding: 15,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 10,
    color: "#0369a1",
    textAlign: "center",
    fontWeight: "light",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0097B2",
    marginBottom: 15,
    paddingBottom: 5,
    borderBottom: "2px solid #0097B2",
  },
});

// PDF component
const BookingConfirmationPDF = ({ booking }) => {
  const bookingDate = new Date(booking.date);
  const paymentDeadline = new Date(bookingDate);
  paymentDeadline.setDate(paymentDeadline.getDate() - 1);
  const deadlineText = paymentDeadline.toLocaleDateString();

  const getStatusStyle = (status) => {
    if (status === "Pending") return styles.statusPending;
    if (status === "Confirmed") return styles.statusConfirmed;
    return styles.fieldValue;
  };

  const shouldShowWarning = booking.status === "Pending";
  const isConfirmed = booking.status === "Confirmed";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Watermark */}
        <Text style={styles.watermark}>ORION SPORTS</Text>

        {/* Header */}
        <Text style={styles.header}>
          {isConfirmed ? "Booking Confirmed" : "Booking Confirmation"}
        </Text>

        {/* Information Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            {isConfirmed 
              ? "Your booking has been confirmed! We look forward to seeing you."
              : "Your booking details are confirmed below. Please complete your payment to secure your booking."}
          </Text>
        </View>

        {/* Booking Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Booking Details</Text>
          
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Booking ID:</Text>
            <Text style={styles.fieldValue}>{booking.bookingId}</Text>
          </View>
          
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Name:</Text>
            <Text style={styles.fieldValue}>{booking.name}</Text>
          </View>
          
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Phone:</Text>
            <Text style={styles.fieldValue}>{booking.phone}</Text>
          </View>
          
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Email:</Text>
            <Text style={styles.fieldValue}>{booking.email}</Text>
          </View>
          
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Court:</Text>
            <Text style={styles.fieldValue}>{booking.courtName}</Text>
          </View>
          
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Date:</Text>
            <Text style={styles.fieldValue}>{bookingDate.toDateString()}</Text>
          </View>
          
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Time Slot:</Text>
            <Text style={styles.fieldValue}>{booking.slot}</Text>
          </View>
          
          {/* Show status for both Confirmed and Pending */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Payment Status:</Text>
            <Text style={getStatusStyle(booking.status)}>{booking.status}</Text>
          </View>
        </View>

        {/* Conditional Messages */}
        {shouldShowWarning ? (
          <Text style={styles.warning}>
            ⚠ Please complete the payment before {deadlineText} to avoid cancellation.
          </Text>
        ) : isConfirmed ? (
          <Text style={styles.successMessage}>
            ✅ Your payment has been confirmed! Your booking is now secured.
          </Text>
        ) : null}

        {/* Footer */}
        <Text style={styles.footer}>
          Thank you for booking with Orion Sports! {"\n"}
          For any queries, please contact our support team.
        </Text>
      </Page>
    </Document>
  );
};

export default BookingConfirmationPDF;