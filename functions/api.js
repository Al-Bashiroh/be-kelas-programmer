// THIS IS FOR NETLIFY APP

require('dotenv').config();

const express = require('express');
const serverless = require('serverless-http');

const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const session = require('express-session');

// connect Database
const connectDB = require('../server/config/db');

const app = express();

app.use(express.static('../public'));

// middleware to read req.body
app.use(express.json());

// cookie parser
// app.use(cookieParser());
// app.use(session({
//     secret: 'tech-albashiroh',
//     resave: false,
//     saveUninitialized: true,
//     store: MongoStore.create({
//         mongoUrl: process.env.MONGODB_URI
//     }),
//     // cookie: { maxAge: new Date( Date.now() + (3600000) ) }
// }))

(async () => {
    try {
        await connectDB();
        console.log("netlify connected to mongodb");
        
        app.use('/', require('../server/routes/main'));
        app.use('/admin', require('../server/routes/admin'));
        app.use('/', require('../server/routes/error'));
    } catch (error) {
        console.log('error api.js');
        console.log(error);
    }
})(); 

console.log('run on serverless production netlify /functions/api');
module.exports.handler = serverless(app);