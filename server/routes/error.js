const express = require('express');
const router = express.Router();

// 404
router.get('/*', async (req, res) => {
    res.status(404).json({
        message: '404 Not Found - Error'
    });
});


module.exports = router;