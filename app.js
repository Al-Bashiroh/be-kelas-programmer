require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const session = require('express-session');
const morgan = require('morgan');
const path = require('path');
const rfs = require('rotating-file-stream');
const jwt = require('jsonwebtoken');

// connect Database
const connectDB = require('./server/config/db');
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static('public'));

// middleware to read req.body
app.use(express.json());

// create a rotating write stream
var accessLogStream = rfs.createStream('access.log', {
    interval: '1d', // rotate daily
    path: path.join(__dirname, 'log')
});
var errorLogStream = rfs.createStream('error.log', {
    interval: '1d', // rotate daily
    path: path.join(__dirname, 'log')
});

morgan.token('user', function getId (req) {
    const token = req.cookies.token;
    console.log('token bro: ' + token);
    if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded.userId;
    } else {
        return '-';
    }
});
// setup the logger
app.use(
    morgan('{"user":":user","date":":date","method":":method","url":":url","http-version":"HTTP/:http-version","status": ":status","response-time":":response-time ms","content-length":":res[content-length]","referer":":referrer","user-agent":":user-agent"}',
        { stream: accessLogStream }));
// log only 4xx and 5xx responses to console
app.use(morgan('dev', {
    skip: function (req, res) { return res.statusCode < 400 },
    stream: errorLogStream
}));

// cookie parser
app.use(cookieParser());
app.use(session({
    secret: 'tech-albashiroh',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
    // cookie: { maxAge: new Date( Date.now() + (3600000) ) }
}));

// use router
app.use('/', require('./server/routes/main'));
app.use('/admin', require('./server/routes/admin'));
app.use('/', require('./server/routes/error'));

app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
});