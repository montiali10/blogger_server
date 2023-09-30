require('dotenv').config()
const express = require('express');
const createError = require('http-errors');
const morgan = require('morgan');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

app.use('/api', require('./routes/api.route'));

app.get('/', (req, res) => {
    
});

app.use((req, res, next) => {
    next(createError.NotFound());
  });
  
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
        status: err.status || 500,
        message: err.message,
    });
});

module.exports = app;