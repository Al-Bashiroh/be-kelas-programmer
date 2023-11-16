const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController')
const santriController = require('../controllers/santriController')

const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

// CHECK AUTH
const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    // set unauthorize
    if (!token) {
        return res.status(401).json({
            message: 'Unauthorize'
        });
    } else {
        // update token max age
        adminController.setToken(res, token)
    }

    // check token
    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.Id = decoded.Id;
        next();
    } catch (error) {
        res.status(401).json({
            message: 'Unauthorize'
        });
    }
}

// GET
router.get('/user', authMiddleware, adminController.getUser);

// AUTH
router.post('/login', adminController.login);
router.post('/register', adminController.register);
router.get('/logout', adminController.logout);

// USE AUTH MIDDLEWARE
// SANTRI
router.post('/santri', authMiddleware, santriController.create);
router.put('/santri', authMiddleware, santriController.update);
router.delete('/santri', authMiddleware, santriController.destroy);

module.exports = router;