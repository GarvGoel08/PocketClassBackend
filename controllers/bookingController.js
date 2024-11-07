const {db} = require("../firebaseConn"); // Firebase admin SDK initialization

const createBooking = async (req, res) => {
  const { userId, instructorId, slotId, additionalComments } = req.body;

  if (!userId || !instructorId || !slotId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const bookingData = {
      userId,
      instructorId,
      slotId,
      additionalComments: additionalComments || '',
      status: 'Pending',
    };

    const bookingRef = db.collection('bookings').doc(); // Create a new booking document
    await bookingRef.set(bookingData);

    res.status(201).json({ message: 'Booking created successfully', bookingId: bookingRef.id });
  } catch (error) {
    console.error("Error creating booking", error);
    res.status(500).json({ message: 'Error creating booking' });
  }
};

const confirmBooking = async (req, res) => {
  const { bookingId } = req.body;

  try {
    const bookingRef = db.collection('bookings').doc(bookingId);
    const bookingDoc = await bookingRef.get();
    if (!bookingDoc.exists) {
      return res.status(404).json({ message: "Booking not found" });
    }

    await bookingRef.update({ status: 'Confirmed' });

    const slotRef = db.collection('slots').doc(bookingDoc.data().slotId);
    await slotRef.update({ status: 'Booked' });

    res.status(200).json({ message: 'Booking confirmed successfully' });
  } catch (error) {
    console.error("Error confirming booking", error);
    res.status(500).json({ message: 'Error confirming booking' });
  }
};

const deleteBooking = async (req, res) => {
  const { bookingId } = req.params;

  try {
    const bookingRef = db.collection('bookings').doc(bookingId);
    const bookingDoc = await bookingRef.get();
    if (!bookingDoc.exists) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const slotRef = db.collection('slots').doc(bookingDoc.data().slotId);
    await slotRef.update({ status: 'Available' });

    await bookingRef.delete();
    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error("Error deleting booking", error);
    res.status(500).json({ message: 'Error deleting booking' });
  }
};
const getUserBookings = async (req, res) => {
  const { userId } = req.params;

  try {
    const bookings = [];
    const snapshot = await db.collection('bookings').where('userId', '==', userId).get();
    snapshot.forEach(doc => {
      bookings.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching user bookings", error);
    res.status(500).json({ message: 'Error fetching user bookings' });
  }
}

const getInstructorBookings = async (req, res) => {
  const { instructorId } = req.params;

  try {
    const bookings = [];
    const snapshot = await db.collection('bookings').where('instructorId', '==', instructorId).get();
    snapshot.forEach(doc => {
      bookings.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching instructor bookings", error);
    res.status(500).json({ message: 'Error fetching instructor bookings' });
  }
}

module.exports = {
  createBooking,
  confirmBooking,
  deleteBooking,
  getUserBookings,
  getInstructorBookings,
};
