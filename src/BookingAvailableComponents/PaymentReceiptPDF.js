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
    backgroundColor: "#00D9A6",
    color: "#fff",
    padding: 20,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 25,
    borderRadius: 8,
    borderBottom: "10px solid #00b386",
  },
  section: {
    marginBottom: 15,
    backgroundColor: "#f8fffc",
    padding: 20,
    borderRadius: 8,
    border: "1px solid #e1f7ef",
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
    color: "#0097B2",
    fontSize: 12,
    width: "30%",
  },
  fieldValue: {
    fontSize: 12,
    width: "65%",
    color: "#333333",
  },
  amountValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#00D9A6",
    width: "65%",
  },
  statusSuccess: {
    color: "#059669",
    fontWeight: "bold",
    fontSize: 12,
    backgroundColor: "#f0fdf4",
    padding: "4px 8px",
    borderRadius: 4,
  },
  statusFailed: {
    color: "#dc2626",
    fontWeight: "bold",
    fontSize: 12,
    backgroundColor: "#fef2f2",
    padding: "4px 8px",
    borderRadius: 4,
  },
  watermark: {
    position: "absolute",
    fontSize: 80,
    color: "#00D9A6",
    opacity: 0.03,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%) rotate(-45deg)",
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
    backgroundColor: "#f0fdf9",
    border: "1px solid #a7f3d0",
    borderRadius: 6,
    padding: 15,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 10,
    color: "#047857",
    textAlign: "center",
    fontWeight: "light",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#00D9A6",
    marginBottom: 15,
    paddingBottom: 5,
    borderBottom: "2px solid #00D9A6",
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
  failedMessage: {
    marginTop: 25,
    marginBottom: 15,
    color: "#dc2626",
    fontWeight: "bold",
    fontSize: 12,
    backgroundColor: "#fef2f2",
    padding: 15,
    borderRadius: 6,
    border: "1px solid #fecaca",
    textAlign: "center",
  },
  receiptNumber: {
    textAlign: "center",
    fontSize: 10,
    color: "#666",
    marginBottom: 10,
    fontWeight: "light",
  },
  amountSection: {
    backgroundColor: "#f0fdf4",
    border: "2px solid #00D9A6",
    borderRadius: 6,
    padding: 15,
    marginVertical: 15,
    textAlign: "center",
  },
  amountLabel: {
    fontSize: 12,
    color: "#047857",
    fontWeight: "bold",
  },
  amountText: {
    fontSize: 20,
    color: "#00D9A6",
    fontWeight: "bold",
    marginTop: 5,
  },
});

// PDF component
const PaymentReceiptPDF = ({ payment }) => {
  const getStatusStyle = (isSuccess) => {
    return isSuccess ? styles.statusSuccess : styles.statusFailed;
  };

  const getStatusMessage = (isSuccess) => {
    return isSuccess ? "Payment Successful" : "Payment Failed";
  };

  const getInfoMessage = (isSuccess) => {
    return isSuccess 
      ? "Your payment has been processed successfully. Thank you for your payment!"
      : "We were unable to process your payment. Please try again or contact support.";
  };

  const generateReceiptNumber = () => {
    return `REC-${payment.bookingId}-${Date.now().toString().slice(-6)}`;
  };

  const isSuccess = payment.paymentSuccess;
  const receiptNumber = generateReceiptNumber();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Watermark */}
        <Text style={styles.watermark}>PAYMENT RECEIPT</Text>

        {/* Header */}
        <Text style={styles.header}>
          {isSuccess ? "Payment Successful" : "Payment Receipt"}
        </Text>

        {/* Receipt Number */}
        <Text style={styles.receiptNumber}>
          Receipt No: {receiptNumber}
        </Text>

        {/* Information Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            {getInfoMessage(isSuccess)}
          </Text>
        </View>

        {/* Amount Section */}
        <View style={styles.amountSection}>
          <Text style={styles.amountLabel}>Total Amount Paid</Text>
          <Text style={styles.amountText}>LKR {payment.courtPrice}</Text>
        </View>

        {/* Payment Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Details</Text>
          
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Booking ID:</Text>
            <Text style={styles.fieldValue}>{payment.bookingId}</Text>
          </View>
          
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Receipt No:</Text>
            <Text style={styles.fieldValue}>{receiptNumber}</Text>
          </View>
          
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Payment Status:</Text>
            <Text style={getStatusStyle(isSuccess)}>
              {getStatusMessage(isSuccess)}
            </Text>
          </View>
          
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Payment Date:</Text>
            <Text style={styles.fieldValue}>
              {new Date(payment.paymentDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Text>
          </View>
          
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Payment Time:</Text>
            <Text style={styles.fieldValue}>
              {new Date(payment.paymentDate).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Text>
          </View>
          
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Amount:</Text>
            <Text style={styles.amountValue}>LKR {payment.courtPrice}</Text>
          </View>
        </View>

        {/* Conditional Messages */}
        {isSuccess ? (
          <Text style={styles.successMessage}>
            ✅ Your payment has been confirmed! Your booking is now secured.
          </Text>
        ) : (
          <Text style={styles.failedMessage}>
            ❌ Payment was not successful. Please try again or contact support.
          </Text>
        )}

        {/* Footer */}
        <Text style={styles.footer}>
          Thank you for choosing Orion Sports! {"\n"}
          For any payment-related queries, please contact our support team. {"\n"}
          This is an computer-generated receipt. No signature required.
        </Text>
      </Page>
    </Document>
  );
};

export default PaymentReceiptPDF;