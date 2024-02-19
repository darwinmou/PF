const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.post('/:id/edit', adminController.confirmUpdate);

router.delete('/:id/delete', adminController.confirmDelete);

module.exports = router;
