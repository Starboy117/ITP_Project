import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/send-booking", async (req, res) => {
  const { email, pdf, bookingId } = req.body;

  try {
    const pdfBuffer = Buffer.from(pdf.split(",")[1], "base64");

    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.BREVO_SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Orion Sports Complex" <mhmammar19@gmail.com>`,
      to: email,
      subject: "Your Booking Confirmation",
      text: "Thank you for your booking! Please find your booking confirmation attached.",
      attachments: [
        {
          filename: `Booking_${bookingId}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

export default router;
