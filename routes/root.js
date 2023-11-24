const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/',(req,res)=>{
    res.status(400 ).json({'message': 'Invalid request URL!'});
});

router.post('/',(req,res)=>{   
    res.json({'message': 'hello'});
});
module.exports = router;