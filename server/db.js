const mysql=require('mysql');
const router=require(express).Router();

var db=mysql.createConnection({
    'database':'',
    'user':'',
    'password':''
});


