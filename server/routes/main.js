const express = require('express');
const router = express.Router();
const santriController = require('../controllers/santriController');

// show cookies
router.get('/', (req, res) => {
    res.json(req.cookies)
});
router.get('/santri', santriController.get);
router.get('/santri/:id', santriController.getById);

module.exports = router;