import React, { useEffect, useState } from "react";
import Sidebar from "../staffPageComponents/sideBar";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";

const Reports = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch report
  const fetchReport = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/report`);
      const data = await res.json();
      setReportData(data.report || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    let csv = '';
    const header = [
      "Court ID","Court Name","Court Type","Status","Capacity",
      "Hourly Rate","Total Reservations","Total Revenue","Total Hours","Utilization Rate",
      "Confirmed","Pending","Cancelled"
    ];
    csv += header.join(",") + "\n";
    reportData.forEach(c => {
      csv += [
        c.courtId,
        `"${c.courtName}"`,
        c.courtType,
        c.status,
        c.capacity,
        c.hourlyRate,
        c.totalReservations,
        c.totalRevenue,
        c.totalHours,
        c.utilizationRate + '%',
        c.statusCounts?.Confirmed || 0,
        c.statusCounts?.Pending || 0,
        c.statusCounts?.Cancelled || 0
      ].join(",") + "\n";
    });
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  useEffect(() => {
    fetchReport();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-neutral-900 text-white">
      <Sidebar />
      <div className="flex-1 p-6 space-y-6 overflow-auto">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Court Analytics & Reports</h2>
            <p className="text-gray-400">Comprehensive court performance analysis</p>
          </div>
          <button
            onClick={downloadCSV}
            className="inline-flex items-center px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors"
          >
            <ArrowDownTrayIcon className="mr-2 h-5 w-5" />
            Export CSV
          </button>
        </div>

        {/* Report Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {reportData.map((court) => (
            <div
              key={court.courtId}
              className="bg-neutral-800 rounded-xl shadow-lg p-6 flex flex-col justify-between h-full hover:bg-neutral-750 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">{court.courtName}</h3>
                  <p className="text-sm text-gray-400">{court.courtType} • {court.location}</p>
                </div>
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    court.status === "Available"
                      ? "bg-green-900 text-green-300"
                      : "bg-red-900 text-red-300"
                  }`}
                >
                  {court.status}
                </span>
              </div>

              <div className="space-y-3 mb-4 text-gray-300 text-sm">
                <div className="flex justify-between">
                  <span>Capacity:</span>
                  <span className="font-medium">{court.capacity} players</span>
                </div>
                <div className="flex justify-between">
                  <span>Hourly Rate:</span>
                  <span className="font-medium">LKR {court.hourlyRate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Reservations:</span>
                  <span className="font-medium">{court.totalReservations}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Revenue:</span>
                  <span className="font-medium text-green-400">LKR {court.totalRevenue?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Utilization Rate:</span>
                  <span className="font-medium">{court.utilizationRate}%</span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-gray-400 text-xs font-semibold mb-2">Booking Status:</p>
                <div className="flex space-x-2 text-xs">
                  <span className="bg-green-900 text-green-300 px-2 py-1 rounded">Confirmed: {court.statusCounts?.Confirmed || 0}</span>
                  <span className="bg-yellow-900 text-yellow-300 px-2 py-1 rounded">Pending: {court.statusCounts?.Pending || 0}</span>
                  <span className="bg-red-900 text-red-300 px-2 py-1 rounded">Cancelled: {court.statusCounts?.Cancelled || 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Reports;
