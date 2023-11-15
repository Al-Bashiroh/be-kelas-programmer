const express = require('express');
const router = express.Router();
const santriController = require('../controllers/santriController');

// SANTRI
router.get('/santri', santriController.get);
router.get('/santri/:id', santriController.getById);

module.exports = router;