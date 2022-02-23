const express = require('express');
const router = express.Router();
const db = require('./database');
const multer  = require('multer');
const path = require('path');
const passport = require('passport');
const { isLoggedIn } = require('./lib/auth');
const { processFile } = require('./lib/contacts');
const { registerFile, getFileList } = require('./lib/file');

// Home Routes
router.get('/',async (req,res) =>{
    res.render('home/home');
});

// File Routes
const upload = multer({ dest: path.join(__dirname,'public') });
router.get('/file/upload',isLoggedIn,(req,res) =>{
    res.render('contacts/add');
});

router.post('/file/upload',isLoggedIn, upload.single('attachment'), async (req, res, next) => {
    const { path, filename, } = req.file;
    const user = req.user;
    const csvData = await registerFile(filename,path,user.id);
    req.flash('success', 'Archivo cargado');
    res.redirect('/file/list');
});

router.get('/file/list',isLoggedIn, async (req, res) => {
    const user = req.user;
    const files = await getFileList(user.id);   
    res.render('files/list',{ files });
});

// Contacts routes
router.get('/contacts/add',isLoggedIn,(req,res) =>{
    res.render('contacts/add');
});


router.get('/contact/process/:id',isLoggedIn, async (req, res, next) => {
    const { id } = req.params;
    const user = req.user;
    const fileId = await processFile(id,user.id);
    if(fileId === 0){
        req.flash('message', 'Archivo no procesado');
        res.redirect('/file/list/');
    } else {
        req.flash('success', 'Procesando');
        res.redirect('/contacts/list/'+id);
    }
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