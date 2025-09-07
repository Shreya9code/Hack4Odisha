const express = require('express');
const router = express.Router();
const ewasteController = require('../controllers/ewasteController');

router.post('/', ewasteController.createEwaste); // donor submits form
router.get('/', ewasteController.getAllEwastes); // vendors see all reports
router.get('/donor/:donorId', ewasteController.getEwasteByDonorId); // get items by donor ID
router.get('/:id', ewasteController.getEwasteById); // scan QR
router.get('/serial/:serial', ewasteController.getEwasteBySerial); // get by serial number for QR scan
router.put('/:id/status', ewasteController.updateStatus); // update status
router.put('/serial/:serial/status', ewasteController.updateStatusBySerial); // update status by serial
router.put('/:id/accept', ewasteController.acceptEwasteItem); // vendor accepts item
router.put('/:id/in-transit', ewasteController.updateToInTransit); // vendor updates to in transit
router.put('/:id/done', ewasteController.updateToDone); // company marks as done
router.post('/update-status', ewasteController.updateStatusWithRole); // new endpoint for role-based status updates
//for removing item.js dont know if its needed
// Basic CRUD routes (replacing items.js)
router.get('/items', ewasteController.getAllItems);
router.post('/items', ewasteController.addItem);
router.get('/items/:id', ewasteController.getItemByIdWithDonor);

module.exports = router;
