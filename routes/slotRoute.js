const express = require('express');
const router = express.Router();
const slotController = require('../controllers/slotController');

router.post('/add', slotController.createSlot);
router.put('/update', slotController.updateSlot);
router.put('/block', slotController.blockSlot);
router.delete('/delete/:slotId', slotController.deleteSlot);
router.put('/book', slotController.bookSlot);
router.get('/instructor/:instructorId', slotController.getInstructorSlots);

module.exports = router;
