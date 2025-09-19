import React from "react";
import { Page, Text, View, Document, StyleSheet, Font } from "@react-pdf/renderer";

// Optional: register a custom font
Font.register({
  family: "Roboto",
  fonts: [
    { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf" },
    { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf", fontWeight: "bold" },
  ],
});

// Styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#f9fafb",
    padding: 30,
    fontFamily: "Roboto",
    position: "relative",
  },
  header: {
    backgroundColor: "#0097B2",
    color: "#fff",
    padding: 15,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  section: {
    marginBottom: 10,
  },
  fieldLabel: {
    fontWeight: "bold",
    color: "#007A8F",
  },
  fieldValue: {
    marginLeft: 10,
  },
  watermark: {
    position: "absolute",
    fontSize: 60,
    color: "red",
    opacity: 0.1,
    top: 250,
    left: 100,
    transform: "rotate(-45deg)",
  },
  warning: {
    marginTop: 20,
    color: "#b00000",
    fontWeight: "bold",
    fontSize: 12,
  },
  footer: {
    marginTop: 40,
    fontSize: 12,
    textAlign: "center",
    color: "#555",
  },
  status:{
    color: "#b00000",
    marginLeft: 10,
  }
});

// PDF component
const BookingConfirmationPDF = ({ booking }) => {
  const bookingDate = new Date(booking.date);
  const paymentDeadline = new Date(bookingDate);
  paymentDeadline.setDate(paymentDeadline.getDate() - 1);
  const deadlineText = paymentDeadline.toLocaleDateString();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        

        <Text style={styles.header}>Booking Confirmation</Text>

        <View style={styles.section}>
          <Text>
            <Text style={styles.fieldLabel}>Booking ID:</Text>
            <Text style={styles.fieldValue}> {booking.bookingId}</Text>
          </Text>
          <Text>
            <Text style={styles.fieldLabel}>Name:</Text>
            <Text style={styles.fieldValue}> {booking.name}</Text>
          </Text>
          <Text>
            <Text style={styles.fieldLabel}>Phone:</Text>
            <Text style={styles.fieldValue}> {booking.phone}</Text>
          </Text>
          <Text>
            <Text style={styles.fieldLabel}>Email:</Text>
            <Text style={styles.fieldValue}> {booking.email}</Text>
          </Text>
          <Text>
            <Text style={styles.fieldLabel}>Court:</Text>
            <Text style={styles.fieldValue}> {booking.court}</Text>
          </Text>
          <Text>
            <Text style={styles.fieldLabel}>Date:</Text>
            <Text style={styles.fieldValue}> {bookingDate.toDateString()}</Text>
          </Text>
          <Text>
            <Text style={styles.fieldLabel}>Time Slot:</Text>
            <Text style={styles.fieldValue}> {booking.slot}</Text>
          </Text>
          <Text>
            <Text style={styles.fieldLabel}>Payment Status:</Text>
            <Text style={styles.status}> {booking.status}</Text>
          </Text>
        </View>

        <Text style={styles.warning}>
          ⚠ Please complete the payment before {deadlineText} to avoid cancellation.
        </Text>

        <Text style={styles.footer}>Thank you for booking with Orion Sports!</Text>
      </Page>
    </Document>
  );
};

export default BookingConfirmationPDF;
