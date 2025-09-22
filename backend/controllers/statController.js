// controllers/statController.js
const { Reservation } = require("../models/reservationModel");

const getWeeklyBookings = async (req, res) => {
  try {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const weekly = await Reservation.aggregate([
      {
        $match: {
          date: { $gte: startOfWeek, $lte: endOfWeek }
        }
      },
      {
        $group: {
          _id: { $dayOfWeek: "$date" }, // 1 = Sunday
          bookings: { $sum: 1 }
        }
      }
    ]);

    // Map to all days with 0 for missing
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weeklyData = days.map((day, idx) => {
      const dayNumber = idx + 1; // $dayOfWeek: 1 = Sunday
      const dayData = weekly.find(w => w._id === dayNumber);
      return { day, bookings: dayData ? dayData.bookings : 0 };
    });

    res.json(weeklyData);
  } catch (err) {
    console.error("Aggregation error:", err);
    res.status(500).json({ error: "Failed to fetch weekly bookings" });
  }
};

module.exports = { getWeeklyBookings };
