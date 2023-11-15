const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');

// ROUTES
router.get('/', async (req, res) => {
    res.send({
        name: "Hallow BROW"
    });
});

// SANTRI
router.get('/santri', mainController.getSantri);
router.get('/santri/:id', mainController.getSantriById);

module.exports = router;