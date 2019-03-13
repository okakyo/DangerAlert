const express=require('express');
const accounts=require('./accounts')
const world=require('./world')
const PORT=8100;

app=express();
app.get('/tabs',world);
app.use(function(req,res,next){
    res.status(404);
    res.end('Not Found! :'+req.path);
})
app.use((err,req,res,next)=>{
    res.status(500);
    res.end('500 Error!:'+err);
});
app.listen(PORT,()=>{
    console.log(`The server is running at http://localhost:${PORT}`);
});