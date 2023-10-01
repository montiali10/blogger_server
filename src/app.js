require('dotenv').config()
const express = require('express');
const createError = require('http-errors');
const morgan = require('morgan');
const path = require('path');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');

const SQLiteStore = require('connect-sqlite3')(session);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(morgan('dev'));
app.locals.pluralize = require('pluralize');


app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new SQLiteStore({ db: 'sessions.db', dir: './' })
}));
app.use(passport.authenticate('session'));

app.use(function(req, res, next) {
    var msgs = req.session.messages || [];
    res.locals.messages = msgs;
    res.locals.hasMessages = !! msgs.length;
    req.session.messages = [];
    next();
});
// app.use(csrf({ cookie: true }));
// app.use(function(req, res, next) {
//     res.locals._csrf = req.csrfToken();
//     next();
// });

// root route
app.use('/api', require('./routes/api.route'));

// auth routes
app.use('/auth', require('./routes/auth'));

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