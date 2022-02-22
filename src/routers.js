const express = require('express');
const router = express.Router();
const db = require('./database')


// home 
router.get('/',async (req,res) =>{
  
    res.send('Hello word');
});

router.get('/contacts/add',(req,res) =>{
    res.render('contacts/add');
});
router.post('/contacts/add',(req,res) =>{
    re.send('recibido',req)
});
router.get('/tasks', async (req, res) => {
    try {
        const result = await db.pool.query("select * from contacts");
        res.send(result);
    } catch (err) {
        throw err;
    }
});

module.exports = router;