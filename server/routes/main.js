const express = require('express');
const router = express.Router();
const Santri = require('../models/santri');

// ROUTES
router.get('/santri', async (req, res) => {
    const santries = await Santri.find();
    res.json(santries);
});

module.exports = router;