const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/user');

// ROUTES

// GET USER
router.get('/user', async (req, res) => {
    try {
        const data = await User.find();

        res.json({
            data
        });
    } catch (error) {
        console.log(error);
    }
});

// DO LOGIN
router.post('/login', async (req, res) => {
    try {
        // console.log(req);
        console.log(req.body);
        const email = req.body.email;
        const password = req.body.password;

        const user = await User.findOne({email: email});

        const hashedPassword = user.password;
        bcrypt.compare(password, hashedPassword, (err, result) => {
            if (err) {
                // Handle the error, such as logging or returning an error response
                console.error(err);
                return;
            }

            if (result) {
                // Passwords match, login successful
                console.log('Login successful');
            } else {
                // Passwords do not match, login failed
                console.log('Login failed');
            }
        })



        // const data = await User.find();

        // res.json({
            // data
            // username
        // });
    } catch (error) {
        console.log(error);
    }
});
// DO REGISTER
router.post('/register', async (req, res) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        User.create({
            name: name,
            email: email,
            password: hashedPassword
        });

        const user = await User.findOne({ email: email }).select('-password');


        // REDIRECT LOGIN
        res.json({
            user
        });

    } catch (error) {
        console.log(error);
    }
});

module.exports = router;