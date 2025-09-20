
const API_BASE_URL = "http://localhost:5000/api/bookings";


const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token
    ? {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    : { "Content-Type": "application/json" };
};


export const addBooking = async (booking) => {
  console.log("Sending booking to backend:", booking);

  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(booking),
    });

    let data;
    try {
      data = await response.json(); 
    } catch (parseError) {
      console.error("Failed to parse JSON from backend:", parseError);
      throw new Error(`Backend returned invalid JSON (status ${response.status})`);
    }

    console.log("Backend response:", response.status, data);

    if (!response.ok) {
      
      const message = data?.error || data?.message || "Failed to create booking";
      throw new Error(message);
    }

    return data;
  } catch (error) {
    console.error("Error adding booking:", error);
    throw error;
  }
};


export const getAllBookings = async () => {
  try {
    const response = await fetch(API_BASE_URL, { headers: getAuthHeaders() });
    const data = await response.json();

    if (!response.ok) {
      const message = data?.error || data?.message || "Failed to fetch bookings";
      throw new Error(message);
    }

    return data;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }
};


export const updateBookingStatus = async (bookingId, status) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${bookingId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });

    const data = await response.json();

    if (!response.ok) {
      const message = data?.error || data?.message || "Failed to update booking";
      throw new Error(message);
    }

    return data;
  } catch (error) {
    console.error("Error updating booking status:", error);
    throw error;
  }
};


export const getSummary = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/summary`, { headers: getAuthHeaders() });
    const data = await response.json();

    if (!response.ok) {
      const message = data?.error || data?.message || "Failed to fetch summary";
      throw new Error(message);
    }

    return data;
  } catch (error) {
    console.error("Error fetching summary:", error);
    return { totalRevenue: 0, totalTickets: 0, totalBookings: 0 };
  }
};
