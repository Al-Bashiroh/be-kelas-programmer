const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const morgan = require('morgan');
const User = require('../models/user');

const jwtSecret = process.env.JWT_SECRET;

const getUser = async (req, res) => {
    try {
        const data = await User.find();

        res.json({
            data
        });
    } catch (error) {
        console.log(error);
    }
}

const login = async (req, res) => {
    try {
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

            after_login_or_register(req, res, user);
        }
    } catch (error) {
        console.log(error);
    }
}

const register = async (req, res) => {
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

        after_login_or_register(req, res, user);
    } catch (error) {
        if (error.code == 11000) {
            res.status(409).json({ message: "Email already registered"});
        }
        res.status(500).json({ message: "Internal server error"});
        console.log(error);
    }
}

// SET AUTH AFTER SUCCESS LOGIN / REGISTER
const after_login_or_register = (req, res, user) => {
    const userId = user._id;
    const token = jwt.sign({
        userId: userId
    }, jwtSecret);

    // set token
    setToken(res, token);

    // add user id to access log
    morgan.token('user', () => userId);

    // Passwords match, login successful
    res.json({
        message: 'Login successful',
        user
    });
}

// expire 1 day
const maxAge = 24 * 60 * 60 * 1000;
const setToken = (res, token) => {
    console.log('set token <<<<<<<<<<<<<<')
    res.cookie('token', token,  {
        httpOnly: true,
        maxAge: maxAge
    });
}

const logout = async (req, res) => {
    try {
        // clear token
        res.clearCookie('token');

        res.json({
            message: "Logout successful"
        });
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getUser,
    login,
    register,
    logout,
    setToken
}