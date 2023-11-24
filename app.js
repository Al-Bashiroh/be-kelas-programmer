require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const session = require('express-session');
const log = require('./server/controllers/logController');
const cors = require('cors');

// connect Database
const connectDB = require('./server/config/db');

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


// cors
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true
}));

// cors allow all
// app.use(cors());


// TODO do we have to save session to database?
// TODO what is the purpose of this session?
// TODO what about if we only record token instead to database
// save session to database
// expire 1 day
// const maxAge = 24 * 60 * 60 * 1000
// app.use(session({
//     secret: 'tech-albashiroh',
//     resave: false,
//     saveUninitialized: true,
//     store: MongoStore.create({
//         mongoUrl: process.env.MONGODB_URI
//     }),
//     // 10 seconds
//     cookie: { maxAge: maxAge }
// }));

// use router
app.use('/', require('./server/routes/main'));
app.use('/admin', require('./server/routes/admin'));

// 404 Not Found
app.use((req, res) => {
    res.status(404).json({
        message: '404 Not Found'
    });
});

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`App is listening on port ${PORT}`);
    });
})