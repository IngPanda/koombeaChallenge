const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../database');
const helpers = require('./helpers');

passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, async (req, email, password, done) => {
    const rows = await db.pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length > 0) {
      const user = rows[0];
      const validPassword = await helpers.matchPassword(password, user.password)
      if (validPassword) {
        done(null, user, req.flash('success', 'Bienvenido ' + user.email));
      } else {
        done(null, false, req.flash('message', 'Contraseña incorrecta'));
      }
    } else {
      return done(null, false, req.flash('message', 'El usuario no existe.'));
    }
}));

passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, async (req, email, password, done) => {
  
    const { fullname } = req.body;
    let newUser = {
      fullname,
      email,
      password
    };
    newUser.password = await helpers.encryptPassword(password);
    const result = await db.pool.query(
      'INSERT INTO users (email,password,fullname) VALUES (?,?,?) ',
       [newUser.email,newUser.password,newUser.fullname]);
    newUser.id = result.insertId;
    return done(null, newUser);
  }));

passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
passport.deserializeUser(async (id, done) => {
    const rows = await db.pool.query('SELECT * FROM users WHERE id = ?', [id]);
    done(null, rows[0]);
});
