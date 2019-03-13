const router=require('express').Router();
var WorldData=require('./custom.geo.json');

router.get('/tab1',(req,res,next)=>{
    res.json(WorldData);
    console.log('Success Connection!');
    console.log(WorldData);
});

module.exports=router;