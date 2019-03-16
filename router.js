const express=require('express');
const accounts=require('./server/accounts')
const world=require('./server/world')
const bodyparser=require('body-parser');
const PORT=8100;

app=express();
app.use(express.static(__dirname+'/www'))
app.use('/server',world);
app.use(bodyparser.urlencoded({'extended':'true'}))
app.use(bodyparser.json());
app.use(function(req,res,next){
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Methods','GET,POST,DELETE,PUT');
    res.header('Access-Control-Allow-Headers','Origin,X-Requested-With,Content-Type,Accept');
    next();
})

app.use('/worlddata',world);

app.use(function(req,res,next){
    res.status(404);
    res.end('Not Found! :'+req.path);
})
app.use((err,req,res,next)=>{
    res.status(500);
    res.end('500 Error!:'+err);
});
app.set('port',process.env.PORT||PORT)
app.listen(app.get('port'),()=>{
    console.log(`The server is running at port`+app.get('port'));
});