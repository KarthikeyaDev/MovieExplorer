
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getAllBookings, updateBookingStatus, getSummary } from "../services/bookingService";
import { useThemeContext } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { FaRupeeSign, FaTicketAlt, FaChartBar } from "react-icons/fa";

const AdminDashboard = () => {
  const { admin, logout } = useAuth(); 
  const navigate = useNavigate();
  const { mode } = useThemeContext();
  const darkMode = mode === "dark";

  const [bookings, setBookings] = useState([]);
  const [summary, setSummary] = useState({ totalRevenue: 0, totalTickets: 0, totalBookings: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const BOOKINGS_PER_PAGE = 10;

 
  useEffect(() => {
    if (!admin) {
      navigate("/login");
    }
  }, [admin, navigate]);

  
  useEffect(() => {
    if (!admin) return; 

    const fetchData = async () => {
      try {
        const data = await getAllBookings();
        const sorted = data.sort((a, b) => new Date(b.bookingTime) - new Date(a.bookingTime));
        setBookings(sorted);

        const summaryData = await getSummary();
        setSummary(summaryData);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [admin]);

  const handleLogout = () => {
    logout();          
    navigate("/login"); 
  };

  const handleStatusChange = async (id, newStatus) => {
    await updateBookingStatus(id, newStatus);
    setBookings((prev) =>
      prev.map((b) => (b._id === id ? { ...b, status: newStatus } : b))
    );
    const summaryData = await getSummary();
    setSummary(summaryData);
  };

  const filteredBookings = useMemo(
    () =>
      bookings.filter(
        (b) =>
          (b.userName || "").toLowerCase().includes(search.toLowerCase()) ||
          (b.userEmail || "").toLowerCase().includes(search.toLowerCase()) ||
          (b.movieTitle || "").toLowerCase().includes(search.toLowerCase())
      ),
    [bookings, search]
  );

  const totalPages = Math.ceil(filteredBookings.length / BOOKINGS_PER_PAGE);
  const paginatedBookings = useMemo(() => {
    const start = (page - 1) * BOOKINGS_PER_PAGE;
    return filteredBookings.slice(start, start + BOOKINGS_PER_PAGE);
  }, [page, filteredBookings]);

  if (loading)
    return (
      <p className={`text-center mt-10 ${darkMode ? "text-white" : "text-gray-900"}`}>
        Loading bookings...
      </p>
    );

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"} min-h-screen p-6`}>
      
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">🎬 Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition text-white font-semibold"
        >
          Logout
        </button>
      </div>

      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {[
          { title: "Total Revenue", value: `₹${summary.totalRevenue}`, icon: <FaRupeeSign /> },
          { title: "Tickets Sold", value: summary.totalTickets, icon: <FaTicketAlt /> },
          { title: "Total Bookings", value: summary.totalBookings, icon: <FaChartBar /> },
        ].map((card) => (
          <div
            key={card.title}
            className={`p-6 rounded-xl shadow-lg flex items-center gap-4 ${
              darkMode ? "bg-gradient-to-r from-gray-800 to-gray-700" : "bg-gradient-to-r from-blue-100 to-blue-200"
            }`}
          >
            <div className="text-3xl">{card.icon}</div>
            <div>
              <h2 className="text-lg font-semibold">{card.title}</h2>
              <p className="text-2xl font-bold mt-1">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      
      <input
        type="text"
        placeholder=" Search by User, Email, or Movie"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className={`w-full p-3 mb-6 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          darkMode
            ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
        }`}
      />

      
      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="min-w-full table-auto">
          <thead className={`${darkMode ? "bg-gray-800" : "bg-gray-200"} text-left`}>
            <tr>
              {["User Name", "Email", "Movie", "Tickets", "Amount", "Show Date", "Booked At", "User Status", "Review Status"].map(
                (col) => (
                  <th key={col} className="px-4 py-3 font-semibold">{col}</th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedBookings.map((b, idx) => (
              <tr
                key={b._id}
                className={`transition ${
                  darkMode
                    ? idx % 2 === 0
                      ? "bg-gray-700"
                      : "bg-gray-800"
                    : idx % 2 === 0
                    ? "bg-white"
                    : "bg-gray-50"
                } hover:bg-blue-50 dark:hover:bg-gray-600`}
              >
                <td className="px-4 py-2">{b.userName || "N/A"}</td>
                <td className="px-4 py-2">{b.userEmail || "N/A"}</td>
                <td className="px-4 py-2">{b.movieTitle || "N/A"}</td>
                <td className="px-4 py-2">{b.numTickets || 0}</td>
                <td className="px-4 py-2">₹{b.totalAmount || 0}</td>
                <td className="px-4 py-2">{b.showDate || "N/A"}</td>
                <td className="px-4 py-2">{b.bookingTime ? new Date(b.bookingTime).toLocaleString() : "N/A"}</td>
                <td className="px-4 py-2">
                  <span className="px-2 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700 border border-green-300">
                    Confirmed
                  </span>
                </td>
                <td className="px-4 py-2">
                  <select
                    value={b.status || "Pending"}
                    onChange={(e) => handleStatusChange(b._id, e.target.value)}
                    className={`px-2 py-1 rounded-lg border font-medium ${
                      darkMode ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                    }`}
                  >
                    <option value="Pending" className="text-yellow-600">Pending</option>
                    <option value="Confirmed" className="text-green-600">Confirmed</option>
                    <option value="Rejected" className="text-red-600">Rejected</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2 flex-wrap">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-4 py-2 rounded-lg font-semibold ${
                page === i + 1
                  ? "bg-blue-600 text-white"
                  : darkMode
                  ? "bg-gray-700 text-white"
                  : "bg-gray-200 text-gray-900"
              } hover:bg-blue-500 transition`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
