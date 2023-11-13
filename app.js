require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const session = require('express-session');
// const expressLayout = require('express-ejs-layouts');

// connect Database
const connectDB = require('./server/config/db');
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static('public'));

// middleware to read req.body
app.use(express.json());

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
}))

// templating engine
// app.use(expressLayout);
// app.use('layout', './layouts/main');
// app.set('view engine', 'ejs');

// use router
app.use('/', require('./server/routes/main'));
app.use('/admin', require('./server/routes/admin'));

// app.use('/', require('./server/routes/main'));

app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
});