const router=require('express').Router();
var WorldData=require('./custom.geo.json');

router.get('/',(req,res)=>{
    res.send(WorldData);
})

module.exports=router;