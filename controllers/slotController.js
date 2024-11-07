const { db } = require("../firebaseConn");

const createSlot = async (req, res) => {
  const {
    instructorId,
    date,
    startTime,
    endTime,
    recurring,
    recurringType,
    recurrenceDays,
    endRecurrenceDate,
    status,
  } = req.body;

  if (!instructorId || !date || !startTime || !endTime) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const slotData = {
      instructorId,
      date: new Date(date),
      startTime: new Date(`${date} ${startTime}`),
      endTime: new Date(`${date} ${endTime}`),
      status: status || "Available",
      recurring: recurring || false,
      recurringType: recurringType || "Weekly",
      recurrenceDays: recurrenceDays || [],
      endRecurrenceDate: endRecurrenceDate ? new Date(endRecurrenceDate) : null,
    };

    const slotRef = db.collection("slots").doc();
    await slotRef.set(slotData);
    const slotDoc = await slotRef.get();

    res
      .status(201)
      .json({
        message: "Slot created successfully",
        slot: { id: slotRef.id, ...slotDoc.data() },
      });
  } catch (error) {
    console.error("Error creating slot", error);
    res.status(500).json({ message: "Error creating slot" });
  }
};

const updateSlot = async (req, res) => {
  const {
    slotId,
    date,
    startTime,
    endTime,
    status,
    recurring,
    recurringType,
    recurrenceDays,
    endRecurrenceDate,
  } = req.body;

  try {
    const slotRef = db.collection("slots").doc(slotId);
    const slotDoc = await slotRef.get();
    if (!slotDoc.exists) {
      return res.status(404).json({ message: "Slot not found" });
    }
    if (slotDoc.data().status === "Booked") {
      return res.status(400).json({ message: "Cannot update a booked slot" });
    }

    const updatedSlotData = {
      date: date ? new Date(date) : slotDoc.data().date,
      startTime: startTime
        ? new Date(`${date} ${startTime}`)
        : slotDoc.data().startTime,
      endTime: endTime
        ? new Date(`${date} ${endTime}`)
        : slotDoc.data().endTime,
      status: status || slotDoc.data().status,
      recurring: recurring !== undefined ? recurring : slotDoc.data().recurring,
      recurringType: recurringType || slotDoc.data().recurringType,
      recurrenceDays: recurrenceDays || slotDoc.data().recurrenceDays,
      endRecurrenceDate: endRecurrenceDate
        ? new Date(endRecurrenceDate)
        : slotDoc.data().endRecurrenceDate,
    };

    await slotRef.update(updatedSlotData);

    res.status(200).json({ message: "Slot updated successfully" });
  } catch (error) {
    console.error("Error updating slot", error);
    res.status(500).json({ message: "Error updating slot" });
  }
};

const blockSlot = async (req, res) => {
  const { slotId } = req.body;

  try {
    const slotRef = db.collection("slots").doc(slotId);
    const slotDoc = await slotRef.get();

    if (!slotDoc.exists) {
      return res.status(404).json({ message: "Slot not found" });
    }

    if (
      slotDoc.data().status === "Booked" ||
      slotDoc.data().status === "Blocked"
    ) {
      return res
        .status(400)
        .json({ message: "Cannot block a booked or already blocked slot" });
    }

    const bookingData = {
      userId: req.body.studentId,
      instructorId: slotDoc.data().instructorId,
      slotId: slotId,
      status: "Pending",
      createdAt: new Date(),
    };

    const bookingRef = db.collection("bookings").doc();
    await bookingRef.set(bookingData);

    await slotRef.update({ status: "Blocked" });

    res
      .status(200)
      .json({
        message: "Slot blocked and booking created successfully",
        bookingId: bookingRef.id,
      });
  } catch (error) {
    console.error("Error blocking slot", error);
    res.status(500).json({ message: "Error blocking slot" });
  }
};

const bookSlot = async (req, res) => {
  const { slotId, bookingId } = req.body;

  try {
    const slotRef = db.collection("slots").doc(slotId);
    const slotDoc = await slotRef.get();
    if (!slotDoc.exists) {
      return res.status(404).json({ message: "Slot not found" });
    }
    if (slotDoc.data().status === "Booked") {
      return res.status(400).json({ message: "Slot already booked" });
    }
    if (slotDoc.data().status === "Blocked") {
      const bookingRef = db.collection("bookings").doc(bookingId);
      const bookingDoc = await bookingRef.get();
      if (bookingDoc.exists && bookingDoc.data().slotId === slotId) {
        await slotRef.update({ status: "Booked" });
        await bookingRef.update({ status: "Confirmed" });
        res.status(200).json({ message: "Slot booked successfully" });
      } else {
        res
          .status(400)
          .json({ message: "Invalid booking ID for blocked slot" });
      }
    } else {
      res.status(400).json({ message: "Slot is not blocked" });
    }
  } catch (error) {
    console.error("Error booking slot", error);
    res.status(500).json({ message: "Error booking slot" });
  }
};

const deleteSlot = async (req, res) => {
  const { slotId } = req.params;

  try {
    const slotRef = db.collection("slots").doc(slotId);
    const slotDoc = await slotRef.get();
    if (!slotDoc.exists) {
      return res.status(404).json({ message: "Slot not found" });
    }

    if (slotDoc.data().status === "Booked") {
      return res.status(400).json({ message: "Cannot delete a booked slot" });
    }

    await slotRef.delete();
    res.status(200).json({ message: "Slot deleted successfully" });
  } catch (error) {
    console.error("Error deleting slot", error);
    res.status(500).json({ message: "Error deleting slot" });
  }
};

const getInstructorSlots = async (req, res) => {
  const { instructorId } = req.params;

  try {
    const slotsRef = db.collection("slots");
    const snapshot = await slotsRef
      .where("instructorId", "==", instructorId)
      .get();

    const slots = [];
    snapshot.forEach((doc) => {
      slots.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json({ slots });
  } catch (error) {
    console.error("Error getting instructor slots", error);
    res.status(500).json({ message: "Error getting instructor slots" });
  }
};

module.exports = {
  createSlot,
  updateSlot,
  blockSlot,
  bookSlot,
  deleteSlot,
  getInstructorSlots,
};
