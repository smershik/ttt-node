var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    console.log(req.query);
    let name = req.query.name?req.query.name:'Anonimous';
    res.render('gamefield',{name:name});
});

module.exports = router;
