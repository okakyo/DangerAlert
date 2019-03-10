const router=require('express').Router();
var WorldData=require('./custom.geo.json');

router.get('/',(req,res,next)=>{
    res.json(WorldData);
    console.log('Success Connection!');
});

module.exports=router;