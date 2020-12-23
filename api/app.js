require('dotenv').config();

// Dependencies
const http = require('http');
const url = require('url');
const path = require('path');
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const parser = require('body-parser');
const flash = require('connect-flash');
const MemoryStore = require('memorystore')(session);
const expressEjsLayouts = require('express-ejs-layouts');

require('./util/passport')(passport);

// Dir
const dataDir = path.resolve(`${process.cwd()}${path.sep}dashboard`);
const templateDir = path.resolve(`${dataDir}${path.sep}views`);

// Routes
const indexRoute = require('./routes/index');
const guildsRoute = require('./routes/guilds');
const guilds = require('./routes/guilds');

// Initialize App
const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 80;

// EJS
app.set('view engine', 'ejs');
app.use(expressEjsLayouts);
app.set('layout', `${path.resolve(`${templateDir}${path.sep}/layout`)}`);
app.set('layout exctractScripts', true);
app.use(express.static(path.join(__dirname + '/public')));

// Parser
app.use(parser.json());
app.use(parser.urlencoded({
    extended: true,
}));

// Session
app.use(session({
    store: new MemoryStore({ checkPeriod: 86400000 }),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

app.locals.domain = process.env.DOMAIN.split('//')[1];

app.use(flash());
app.use((req, res, next) => {
    res.locals.success_mg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

app.get('/login', (req, res, next) => {
    if (req.headers.referer) {
        const parsed = url.parse(req.headers.referer);
        if (parsed.hostname === app.locals.domain) {
            req.session.backURL = parsed.path;
        }
    } else {
        req.session.backURL = '/';
    }

    next();
}, passport.authenticate('discord'));

app.get('/callback', passport.authenticate('discord', { failureRedirect: '/' }), (req, res) => {
    if (req.session.backURL) {
        const url = req.session.backURL;
        req.session.backURL = null;
        res.redirect(url);
    } else {
        res.redirect('/');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        req.logout();

        res.redirect('/');
    });
});

app.use('/', indexRoute);
app.use('/guild', guildsRoute)

server.listen(port, () => {
    console.info(`Listening on ${port}`);
});

exports.componentToHex = (c) => {
    let hex = c.toString(16);
    return hex.length == 1 ? '0' + hex : hex;
};