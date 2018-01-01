var express=require('express');
var path = require('path');
var app = express();

app.use(express.static(path.join(__dirname,'public')));

app.listen('5000',function(){
    console.log('PWA Shell server started @5000');
});

app.get('/',function(req,res){
    res.redirect('views/index.html');
});