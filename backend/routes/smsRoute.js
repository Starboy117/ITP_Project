import express from "express";
import axios from "axios";

const router = express.Router();

// POST /api/sms/send
router.post("/send-sms", async (req, res) => {
  const { phone, message } = req.body;

  if (!phone || !message) {
    return res.status(400).json({
      success: false,
      message: "Phone and message are required",
    });
  }

  try {
    const response = await axios.post(
      "https://app.text.lk/api/v3/sms/send",
      {
        recipient: phone.startsWith("+") ? phone : `+${phone}`,
        message: message,
        sender_id: "TextLKDemo" // ✅ v3 approved sender ID
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.TEXTLK_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.status === "success") {
      return res.json({ success: true, data: response.data });
    } else {
      console.error("SMS failed:", response.data);
      return res.status(500).json({
        success: false,
        message: "SMS not sent",
        data: response.data,
      });
    }
  } catch (err) {
    console.error("SMS send error:", err.response?.data || err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to send SMS",
    });
  }
});

export default router;
