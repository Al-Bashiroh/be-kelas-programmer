require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const session = require('express-session');
const log = require('./server/controllers/logController')

// connect Database
const connectDB = require('./server/config/db');
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static('public'));

// middleware to read req.body
app.use(express.json());

// make sure token is cookies is available
app.use(log.getUserToken());
// access logs
app.use(log.accessLogger);
app.use(log.errorLogger);

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

// 404 Not Found
app.use((req, res) => {
    res.status(404).json({
        message: '404 Not Found'
    });
});

app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
});