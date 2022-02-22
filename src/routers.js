const express = require('express');
const router = express.Router();
const db = require('./database');
const multer  = require('multer');
const path = require('path');
const { readCsv } = require('./lib/utils');
const passport = require('passport');
const { isLoggedIn } = require('./lib/auth');


// Home Routes
router.get('/',async (req,res) =>{
  
    res.send('Hello word');
});
// Contacts routes
router.get('/contacts/add',(req,res) =>{
    res.render('contacts/add');
});
const upload = multer({ dest: path.join(__dirname,'public') });

router.post('/contacts/add', upload.single('attachment'), function (req, res, next) {
    const { path } = req.file;
    readCsv(path);
    req.flash('success', 'Procesando');
    res.redirect('/contacts/list');
});

router.get('/contacts/list', async (req, res) => {
    try {
        const result = await db.pool.query("select * from contacts");
        res.render('contacts/list');
    } catch (err) {
        throw err;
    }
});
// User Routes
router.get('/user/signup',(req,res) =>{
    res.render('user/signup');
});
router.get('/user/signin',(req,res) =>{
    res.render('user/signin');
});
router.post('/user/signup', passport.authenticate('local.signup', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/signup',
    failureFlash: true
}));

router.post('/user/signin', (req, res, next) => {
    req.check('email', 'El correo es requerido').notEmpty();
    req.check('password', 'La contraseña es requerida').notEmpty();
    const errors = req.validationErrors();
    if (errors.length > 0) {
      req.flash('message', errors[0].msg);
      res.redirect('/user/signin');
    }
    passport.authenticate('local.signin', {
      successRedirect: '/user/profile',
      failureRedirect: '/user/signin',
      failureFlash: true
    })(req, res, next);
s});
  
router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/');
});

router.get('/user/profile', isLoggedIn, (req, res) => {
    res.render('user/profile');
}); 



module.exports = router;