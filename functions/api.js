// THIS IS FOR NETLIFY APP

require('dotenv').config();

const express = require('express');
const serverless = require('serverless-http');

// connect Database
const connectDB = require('../server/config/db');

const app = express();

app.use(express.static('../public'));

(async () => {
    try {
        await connectDB();
        console.log("netlify connected to mongodb");
        app.use('/', require('../server/routes/main'));
    } catch (error) {
        console.log('error api.js');
        console.log(error);
    }
})(); 

console.log('run on serverless production netlify /functions/api');
module.exports.handler = serverless(app);