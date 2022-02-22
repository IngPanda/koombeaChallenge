const express = require('express');
const router = express.Router();
const db = require('./database');
const multer  = require('multer');
const path = require('path');
const { readCsv, deleteFile } = require('./lib/utils');
const passport = require('passport');
const { isLoggedIn } = require('./lib/auth');
const { processDataFile } = require('./lib/contacts');
const { reegisterFile } = require('./lib/file');

// Home Routes
router.get('/',async (req,res) =>{
    res.render('home/home');
});
// File 
const upload = multer({ dest: path.join(__dirname,'public') });
router.get('/file/upload',isLoggedIn,(req,res) =>{
    res.render('contacts/add');
});

router.post('/file/upload',isLoggedIn, upload.single('attachment'), async (req, res, next) => {
    const { path, filename, } = req.file;
    const user = req.user;
    const csvData = await reegisterFile(filename,path,user.id);
    req.flash('success', 'Archivo cargado');
    res.redirect('/file/list');
});
router.get('/file/list',isLoggedIn, async (req, res) => {
    try {
        const user = req.user;
        const files = await db.pool.query("select * from files where user_id = ?",[user.id]);
        res.render('files/list',{ files: files.filter((data, index) => index !== 'meta') });
    } catch (err) {
        throw err;
    }
});
// Contacts routes
router.get('/contacts/add',isLoggedIn,(req,res) =>{
    res.render('contacts/add');
});


router.get('/contact/process/:id',isLoggedIn, async (req, res, next) => {
    const { id } = req.params;
    const user = req.user;
    let files = await db.pool.query("select * from files where id = ?",[id]);
    let file = files.filter((data, index) => index !== 'meta')[0];
    const csvData = await readCsv(file.path);
    // deleteFile(path);
    await processDataFile(csvData,user.id);
    req.flash('success', 'Procesando');
    // res.redirect('/contacts/list/'+id);
});


router.get('/contacts/list/:id',isLoggedIn, async (req, res) => {
    try {
        const { id } = req.params;
        const contacts = await db.pool.query("select * from contacts where file_id = ?",[id]);
        res.render('contacts/list',{ contacts });
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
    /*req.check('email', 'El correo es requerido').notEmpty();
    req.check('password', 'La contraseña es requerida').notEmpty();
    const errors = req.validationErrors();
    if (errors.length > 0) {
      req.flash('message', errors[0].msg);
      res.redirect('/user/signin');
    }*/
    passport.authenticate('local.signin', {
      successRedirect: '/user/profile',
      failureRedirect: '/user/signin',
      failureFlash: true
    })(req, res, next);
});
  
router.get('/user/logout', (req, res) => {
    req.logOut();
    res.redirect('/');
});

router.get('/user/profile', isLoggedIn, (req, res) => {
    res.render('user/profile');
}); 



module.exports = router;