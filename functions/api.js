require('dotenv').config();

const express = require('express');
const serverless = require('serverless-http');

const is_local = process.env.APP_ENV == 'local';
const is_production = process.env.APP_ENV == 'production';
// const expressLayout = require('express-ejs-layouts');

// connect Database
const connectDB = require('../server/config/db');
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static('public'));

// templating engine
// app.use(expressLayout);
// app.use('layout', './layouts/main');
// app.set('view engine', 'ejs');

// use router
// app.use('/', require('../server/routes/main'));
app.use('/', require('../server/routes/main'));

// app.use('/', require('./server/routes/main'));

if (!is_production) {
    console.log('run on serverless production');
    module.exports.handler = serverless(app)
} else {
    app.listen(PORT, () => {
        console.log(`App is listening on port ${PORT}`);
    });
}