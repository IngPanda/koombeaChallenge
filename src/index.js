const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const MariaDBStore = require('express-session-mariadb-store');
const db = require('./database');
const flash = require('connect-flash');

// initializations

const app = express();
require('./lib/passport');

// setings

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname,'views'));


app.engine('hbs', exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'),'layouts'),
    partialsDir: path.join(app.get('views'),'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars'),
}));
app.set('view engine','.hbs');

// middleware

app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(passport.initialize());
app.use(session({
    store: new MariaDBStore({
      pool: db.pool,
    }),
    secret: 'koombeaChanllenge',
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.session());
app.use(flash());


// global variables

app.use((req, res, next) => {
    app.locals.message = req.flash('message');
    app.locals.success = req.flash('success');
    app.locals.user = req.user;
    next();
});


// routes
app.use(require('./routers'));

// Public files

app.use(express.static(path.join(__dirname,'public')));

// start server

app.listen(app.get('port'),()=>{
    console.log('Server start on port: '+app.get('port'));
});

