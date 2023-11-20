const express = require('express');
const router = express.Router();

const auth = require('../controllers/authController')
const authController = require('../controllers/authController')
const adminController = require('../controllers/adminController')
const santriController = require('../controllers/santriController')

// const jwt = require('jsonwebtoken');
// const jwtSecret = process.env.JWT_SECRET;

// CHECK AUTH
// const authMiddleware = (req, res, next) => {
//     const token = req.cookies.token;

//     // set unauthorize
//     if (!token) {
//         return res.status(401).json({
//             message: 'Unauthorize'
//         });
//     } else {
//         // update token max age
//         auth.setToken(res, token)
//     }

//     // check token
//     try {
//         const decoded = jwt.verify(token, jwtSecret);
//         req.Id = decoded.Id;
//         next();
//     } catch (error) {
//         res.status(401).json({
//             message: 'Unauthorize'
//         });
//     }
// }

// GET
router.get('/user', auth.checkToken, adminController.getUser);

// AUTH
router.post('/login', auth.login);
router.post('/register', auth.register);
router.get('/logout', auth.logout);
router.get('/checkAuth', auth.checkToken, authController.checkAuth);

// USE check token
// SANTRI
router.get('/santri', auth.checkToken, santriController.get);
router.get('/santri/:id', auth.checkToken, santriController.getById);
router.post('/santri', auth.checkToken, santriController.create);
router.put('/santri', auth.checkToken, santriController.update);
router.delete('/santri', auth.checkToken, santriController.destroy);

module.exports = router;