// THIS IS FOR NETLIFY APP

require('dotenv').config();

const express = require('express');
const serverless = require('serverless-http');

// connect Database
const connectDB = require('../server/config/db');
connectDB();

const app = express();

app.use(express.static('public'));

app.use('/', require('../server/routes/main'));

console.log('run on serverless production netlify /functions/api');
module.exports.handler = serverless(app)