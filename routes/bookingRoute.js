const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.post('/add', bookingController.createBooking);
router.put('/confirm', bookingController.confirmBooking);
router.delete('/delete/:bookingId', bookingController.deleteBooking);
router.get('/user/:userId', bookingController.getUserBookings);
router.get('/instructor/:instructorId', bookingController.getInstructorBookings);

module.exports = router;
