const express = require('express');
const router = express.Router();

// ROUTES
router.get('/', (req, res) => {
    // res.send("Hello bro dari router");
    // res.json({
    //     "name": "putera"
    // })
    res.send({
        "name": "putera"
    })
});

module.exports = router;