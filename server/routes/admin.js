const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();
const User = require('../models/user');

const jwtSecret = process.env.JWT_SECRET;

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

        var user = await User.findOne({ email });

        if (!user) {
            res.status(401).json({
                message: "Invalid credentials"
            });
        }

        const hashedPassword = user.password;
        const isPasswordValid = await bcrypt.compare(password, hashedPassword);

        if (!isPasswordValid) {
            res.status(401).json({
                message: "Invalid credentials"
            });
        } else {
            // LOGIN SUCCESS
            user = await User.findOne({ email }).select('-password');

            // SET TOKEN
            const token = jwt.sign({
                userId: user._id
            }, jwtSecret);
            res.cookie('token', token,  { httpOnly: true });

            // Passwords match, login successful
            res.json({
                message: 'Login successful',
                user
            });
        }

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

        await User.create({
            name: name,
            email: email,
            password: hashedPassword
        });

        const user = await User.findOne({ email }).select('-password');


        // REDIRECT LOGIN
        res.status(201).json({
            message: 'User created',
            user
        });
    } catch (error) {
        console.log("ERROR RRRRRRR BROOOOO");
        if (error.code == 11000) {
            res.status(409).json({ message: "Email already registered"});
        }
        res.status(500).json({ message: "Internal server error"});
        console.log(error);
    }
});

module.exports = router;