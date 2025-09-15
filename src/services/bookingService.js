import { db } from "../auth/firebase";
import { collection, addDoc, getDocs, doc, updateDoc } from "firebase/firestore";


export const addBooking = async (booking) => {
  try {
    const docRef = await addDoc(collection(db, "bookings"), booking);
    console.log("Booking stored with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding booking: ", e);
  }
};


export const getAllBookings = async () => {
  const snapshot = await getDocs(collection(db, "bookings"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};


export const updateBookingStatus = async (bookingId, status) => {
  const bookingRef = doc(db, "bookings", bookingId);
  await updateDoc(bookingRef, { status });
};

