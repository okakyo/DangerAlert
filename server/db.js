var mysql=require('mysql');
var express=require('express')
var db=mysql.createConnection({
    });

db.connect(function(err){
    if(err) throw err;
    else
    console.log('Success!');
});

//以下のサーバーの内容が、アカウントの管理
var tbname;
var input;

//"return" で返すことで、以下のようにテーブル名だけが変更して、それ以外は同じ場合でも
//引数で入力した値をそのまま使うことができる。
exports.db_get=function(tbname){
    return function(req,res,next) {
    db.query(`select * from ${tbname}`,function(err,rows){
        if (err) throw err;
        else{
            console.log(rows);
            res.json(rows);
        }});
    }
}
exports.db_detail=function(tbname){
return function(req,res,next){
   db.query(`select * from ${tbname} where id=?`,[req.params.id],function(err,rows){
       if (err) throw err;
       else{
           console.log('以下のデータを変更します。');
           console.log(rows); 
           res.json(rows[0]);
        };
});
}};
exports.db_post=function(tbname){
    return function(req,res,next){
        let input=req.body;
    db.query(`Insert into  ${tbname} set ?`,input,function(err,rows){
        if(err) { 
            console.log(err);
            res.redirect('/')
        }
        else{
              console.log('以下のデータを作成しました。');
              console.log(rows);
              res.json(rows);
            }});
        };　
    };

exports.db_update=function(tbname){
return function(req,res,next){
    //これで、どんなデータでも入力できるシステムができる。
        let input=req.body;
    
        console.log(`ID=${input.id}のデータを更新していきます。`)
    db.query(`update ${tbname} set ? where id=? `,[input,req.body.id],function(err,rows){
            if(err)
                console.log(err);
            res.json(rows);
            
            
    });
};
};


exports.db_delete=function(tbname){
    return function(req,res,next){
    db.query('delete from '+tbname+' where id=?',[req.params.id],function(err,rows){
        if (err) throw err;
        res.json(rows);
        });
};
};




