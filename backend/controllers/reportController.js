const Court = require("../models/courtModel");
const { Reservation } = require("../models/reservationModel");

// ----------------- Helper: Calculate Utilization -----------------
const calculateUtilization = (totalHours, openHoursPerDay = 18) => {
  if (!openHoursPerDay || openHoursPerDay === 0) return 0;
  const utilization = (totalHours / openHoursPerDay) * 100;
  return Math.round(utilization * 100) / 100; // Round to 2 decimals
};

// ----------------- Generate Report -----------------
const generateReport = async (req, res) => {
  try {
    const { startDate, endDate, courtType } = req.query;

    // Build date filter
    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    // Fetch all courts
    let courts = await Court.find();
    if (courtType && courtType !== 'all') {
      courts = courts.filter(c => c.courtType === courtType);
    }

    // Fetch reservations filtered by date
    const reservationFilter = Object.keys(dateFilter).length > 0 ? { date: dateFilter } : {};
    const reservations = await Reservation.find(reservationFilter);

    // Build report
    const report = courts.map(court => {
      const courtReservations = reservations.filter(r => r.courtName === court.courtName);

      const statusCounts = { Confirmed: 0, Pending: 0, Cancelled: 0, Completed: 0 };
      courtReservations.forEach(r => {
        statusCounts[r.status] = (statusCounts[r.status] || 0) + 1;
      });

      const totalReservations = courtReservations.length;
      const totalHours = totalReservations; // Each reservation = 1 hour
      const totalRevenue = totalHours * court.hourlyRate;
      const utilizationRate = calculateUtilization(totalHours, 18); // 18 hours/day

      return {
        courtId: court.courtId,
        courtName: court.courtName,
        courtType: court.courtType,
        status: court.status,
        capacity: court.capacity,
        hourlyRate: court.hourlyRate,
        location: court.location,
        reservations: courtReservations.map(r => ({
          _id: r._id,
          name: r.name,
          status: r.status,
          date: new Date(r.date).toLocaleDateString(),
          startTime: r.startTime,
          endTime: r.endTime,
        })),
        totalReservations,
        totalHours,
        totalRevenue,
        utilizationRate,
        statusCounts
      };
    });

    const overallStats = {
      totalCourts: courts.length,
      totalReservations: reservations.length,
      totalRevenue: report.reduce((sum, c) => sum + c.totalRevenue, 0),
      availableCourts: courts.filter(c => c.status === 'Available').length,
      maintenanceCourts: courts.filter(c => c.status === 'Maintenance').length
    };

    res.status(200).json({ report, overallStats, filters: { startDate, endDate, courtType } });

  } catch (err) {
    console.error("Error generating report:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { generateReport };
