require('dotenv').config();
const rfs = require('rotating-file-stream');
const morgan = require('morgan');
const path = require('path');
const jwt = require('jsonwebtoken');

// log format
const log_format = '{"user":":user","method":":method","url":":url","date":":date","http-version":"HTTP/:http-version","status": ":status","response-time":":response-time ms","content-length":":res[content-length]","referer":":referrer","user-agent":":user-agent"}';

// create a rotating write stream
var accessLogStream = rfs.createStream('access.log', {
    interval: '1d', // rotate daily
    path: path.join(__dirname, '../../log')
});
var errorLogStream = rfs.createStream('error.log', {
    interval: '1d', // rotate daily
    path: path.join(__dirname, '../../log')
});

function getUserId(req, res) {
    const token = req.cookies.token;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            return decoded.userId;
        } catch (error) {
            // TODO remove token if unauthorized
            // res.clearCookie('token');
            return '-';
        }
    } else {
        return '-';
    }
}

function getUserToken() {
    return (req, res, next) => {
        morgan.token('user', getUserId);
        next();
    };
}

// log success access
const accessLogger = morgan(log_format, {
    skip: (req, res) => res.statusCode > 400,
    stream: accessLogStream
});

// log only 4xx and 5xx responses to console
const errorLogger = morgan(log_format, {
    skip: (req, res) => res.statusCode < 400,
    stream: errorLogStream
});

module.exports = {
    accessLogger,
    errorLogger,
    getUserToken
}