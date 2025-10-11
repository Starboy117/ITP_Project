import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import Navbar from "../HomeComponents/Navbar";
import Footer from "../BookingAvailableComponents/CopyrightFooter";

export default function ViewBookings() {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/reservations/user", {
          withCredentials: true,
        });
        setBookings(res.data.bookings);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const getStatusStyles = (status) => {
    const baseStyles = "px-3 py-1 rounded-full text-sm font-medium";
    switch (status.toLowerCase()) {
      case "confirmed":
        return `${baseStyles} bg-green-500/20 text-green-400 border border-green-500/30`;
      case "pending":
        return `${baseStyles} bg-yellow-500/20 text-yellow-400 border border-yellow-500/30`;
      case "cancelled":
        return `${baseStyles} bg-red-500/20 text-red-400 border border-red-500/30`;
      default:
        return `${baseStyles} bg-gray-500/20 text-white border border-gray-500/30`;
    }
  };

  const SkeletonLoader = () => (
    <div className="grid md:grid-cols-2 gap-6">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="bg-gray-800/50 p-6 rounded-xl animate-pulse">
          <div className="h-6 bg-gray-700 rounded mb-4 w-3/4"></div>
          <div className="h-4 bg-gray-700 rounded mb-2 w-1/2"></div>
          <div className="h-4 bg-gray-700 rounded mb-2 w-2/3"></div>
          <div className="h-4 bg-gray-700 rounded w-1/3"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 to-neutral-800 text-white flex flex-col pb-5">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#0097B2] to-teal-400 bg-clip-text text-transparent">
            Your Bookings
          </h1>
          <p className="text-gray-400 text-lg">
            Manage and view all your court reservations
          </p>
        </div>

        {loading ? (
          <SkeletonLoader />
        ) : bookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 text-gray-500">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              No bookings found
            </h3>
            <p className="text-gray-500">
              You haven't made any reservations yet.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((b) => (
              <div 
                key={b._id} 
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:border-[#0097B2]/30 group"
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-white group-hover:text-[#0097B2] transition-colors duration-300">
                    {b.courtName}
                  </h2>
                  <span className={getStatusStyles(b.status)}>
                    {b.status}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center text-gray-300">
                    <svg className="w-4 h-4 mr-3 text-[#0097B2]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                    </svg>
                    <span className="font-medium">Date:</span>
                    <span className="ml-2">{new Date(b.date).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-300">
                    <svg className="w-4 h-4 mr-3 text-[#0097B2]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                    </svg>
                    <span className="font-medium">Time:</span>
                    <span className="ml-2">{b.startTime} - {b.endTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}