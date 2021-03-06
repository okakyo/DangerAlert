const express=require('express');
const accounts=require('./server/accounts')
const world=require('./server/world')
const bodyparser=require('body-parser');
const puppeteer=require('puppeteer');
const PORT=8100;
var fs=require('fs');
var https=require('https');
data=JSON.parse(fs.readFileSync('./src/app/tab1/custom.geo.json'),'utf8')
var CronJob=require('cron').CronJob;

const URL="https://www.travel-advisory.info/api";
async function getData(){
    const browser= await puppeteer.launch({args:[
        '--no-sandbox',
        '--disable-setuid-sandbox'
    ]});
    const page=await browser.newPage();
    for(key in data.features){
        var setData=data.features[key].properties;       
        var html='申し訳ございません。ニュースを取得できませんでした。';
        if(setData.URL){
            await page.goto(`https://www.anzen.mofa.go.jp${setData.URL}`);
            
            var html=await page.$$eval('.kiken_unit',e=>{
                return e.length==1?e[0].innerText:e[1].innerText;
                });
            
        }
        setData.news=html;
        await page.waitFor(1000);
    }
    browser.close();
}
function ChangeJson(){
    return https.get(URL,function(res){
    var body='';
    res.setEncoding('utf8');
    res.on('data',function(chunk){
        body+=chunk;
    });
    res.on('end',function(chunk){
      countries=JSON.parse(body);
      for(key in data.features){
        get_name=data.features[key].properties.name;
        if(get_name in AppendCountry==true)
            get_name=AppendCountry[get_name]

        for(country in countries.data){
            country_name=countries.data[country].name
                if(get_name===country_name){
                    setData=data.features[key].properties
                    setData.security=countries.data[country].advisory.score;
                    setData.update=countries.data[country].advisory.updated
                    break
                }
            }
        }

//この中に、puppeteer の実装を行う。
//サーバーサイドでエラーが生じたら、その都度対策を考える。

getData()

fs.writeFileSync('./src/app/tab1/custom.geo.json',JSON.stringify(data));
date=new Date();
console.log('Action Done! at '+date.getFullYear()+'/'+date.getMonth()+'/'+date.getDate());
    }).on('error',function(e){
      console.log(e.message);
    })
  })
  }
AppendCountry={"Dominican Rep.":"Dominican Republic",
               "Falkland Is.":"Falkland Islands",
               "Korea":"South Korea",
                "Lao PDR":"Laos",
                "Dem. Rep. Korea":"North Korea",
                "Palestine":"Palestinian Territory",
                "Timor-Leste":"East Timor",
                "Central African Rep.":"Central African Republic",
                "Dem. Rep. Congo":"Democratic Republic of the Congo",
                "Côte d'Ivoire":"Ivory Coast",
                "Congo":"Republic of the Congo",
                "Eq. Guinea":"Equatorial Guinea",
                "W. Sahara":"Western Sahara",
                "S. Sudan":"Sudan",
                "Somaliland":"Somalia",
                "Bosnia and Herz.":"Bosnia and Herzegovina",
                "Czech Rep.":"Czech Republic",
                "Solomon Is.":"Solomon Islands",
                "N. Cyprus":"Cyprus"
}
var cron =new CronJob('00 00 10 * * *',()=> {
    ChangeJson();
    console.log('Changed the Json');
    },null,true
)

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
    res.redirect('/');
})
app.use((err,req,res,next)=>{
    res.status(500);
    res.end('500 Error!:'+err);
});
app.set('port',process.env.PORT||PORT)
app.listen(app.get('port'),()=>{
    cron.start();
    console.log(`The server is running at port`+app.get('port'));
});

