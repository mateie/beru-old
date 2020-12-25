require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const usersRoute = require('./routes/users');
const discordRoute = require('./routes/discord');

const app = express();

app.use(
    bodyParser.urlencoded({
        extended: false,
    })
);
app.use(bodyParser.json());

passport.serializeUser((user, done) => done(null, user));

passport.deserializeUser((user, done) => done(null, user));

mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.info('Connected to the database on server'))
.catch(err => console.error(err));

app.use(passport.initialize());
require('./config/passport')(passport);

app.use('/discord', discordRoute);
app.use('/', (req, res) => res.redirect(`${process.env.DOMAIN}:3000`));


module.exports = app;