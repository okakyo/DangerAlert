import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, Config, ModalController, Platform } from '@ionic/angular';
import leaflet from 'leaflet';
import { Observable, } from 'rxjs';
import * as Data from './custom.geo.json';

import { SemiModalPage } from '../semi-modal/semi-modal.page';

//jsonファイルより、国境、国の危険状態を取得
var worldBorder: Observable<any>=Data['features'];
var before=null;
 
var CountryName:String='未入力';
var DangerLevel:number=null;
var Info:String= '気になる国をクリックしてください。';
var InfoURL:string='/';


var windowOn:boolean=true;

//世界地図のデータを取得
var leaf=leaflet.tileLayer(`http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`, {
      attributions: 'Made by Kyhohei Oka',
      maxZoom: 20,
      minZoom: 2,
    })
// 地図に国の情報を地図に載せる
var map:any;
function highLight(e){
  var layer=e.target;
  layer.setStyle({
    weight:7,
    color:'#666',
    dashArray:'',
    fillOpacity:0.7
  });
  
}
function resetHighLight(e){
  if(e.target!=before)
   geo.resetStyle(e.target);
  
}
function clickFeature(e){
  if (before!=null)
    geo.resetStyle(before);
    
  var layer =e.target;
  layer.setStyle({
    weight:7,
    color:'#666',
    dashArray:'',
    fillOpacity:0.7
  });
  getCountryInfo(e.latlng,layer.feature.properties);
  if (windowOn){
    CountryInfo.addTo(map);
    windowOn=false;
  }  
  else
  CountryInfo.update()
  
  before=layer;
}
function getCountryInfo(latlng,props){
  CountryName=props.jp_name;
  DangerLevel=props.security;
  Info=props.news;
  InfoURL=props.URL;
  var InfoHTML:String=`
    <h3>${CountryName}</h3>
    <h4>危険度：${DangerLevel}</h4>
  `;
  popup.setLatLng(latlng)
  .setContent(InfoHTML)
  .openOn(map);
  
};

function onEachFeature(feature,layer){
  layer.on({
    mouseover: highLight,
    mouseout: resetHighLight,
    click: clickFeature,
    
  })
}


function getColor(d){
  return d>4 ? 'red' :d>3 ? 'orange': d>2 ? 'yellow' : d>=1 ? '#43FF6B': 'grey'
}

function style(feature){
    var d:number= feature.properties.security;
    return {
      fillColor: getColor(d) ,
      weight: 5,
      opacity: 0.5,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.5
    }
  }
var geo=leaflet.geoJson(worldBorder, {style:　style, onEachFeature: onEachFeature});


//各国の国の詳細な情報を取得

var popup=leaflet.popup();

var CountryInfo=leaflet.control({position:'bottomleft'});
CountryInfo.onAdd= function(map){
  this._div=leaflet.DomUtil.create('div','info information');
  this._div.style.marginBottom=0;
  this._div.style.marginLeft=0;
  this.update();
  this._div.onclick=function(e){
    e.preventDefault();
    e.stopPropagation();
  }
  return this._div
}
CountryInfo.update=function(props){
  this._div.innerHTML=`
    <ion-card style="max-width:408px;max-height:300px;">
        <ion-card-header color="primary">
        <ion-title>${CountryName}</ion-title>
        <ion-subtitle>危険度：${DangerLevel}<ion-subtitle>
        
      </ion-card-header>
      <ion-card-content style="max-height:120px; overflow:auto; padding:10px">
      <ion-text>
      ${Info}
      </ion-text>
      </ion-card-content>
    </ion-card>
  `
}

var legend=leaflet.control();

legend.onAdd=function(map){
  this.div=leaflet.DomUtil.create('div', 'info legend');
  var grades=[1,2,3,4]
  this.div.innerHTML='<h5>危険度レベル</h5><br/>'
  for(var i=0;i<grades.length;i++){
    this.div.innerHTML+='<i style="background:'+getColor(grades[i] + 1)+'"></i>'
    +grades[i]+'&ndash;'+(grades[i+1] ?grades[i+1]+'<br/>':'');
  }
  
  return this.div
}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

//　クラスの実装内容

export class Tab1Page {
  @ViewChild('map') mapContainer: ElementRef;
  map: any;
  CountryName:String=CountryName;
  DangerLevel:Number=DangerLevel;
  Info:String=Info;
  ButtonLocation='start';
  constructor(public navCtrl: NavController,public modalCtrl:ModalController,public plt:Platform){}
  
  ionViewDidEnter() {
    this.loadmap();
  }

  getLocation(){
    this.map.locate({
      setView: true,
      maxZoom: 5
    })
  .on('locationfound', (e) => {
    let markerGroup = leaflet.featureGroup();
    

    let marker: any = leaflet.marker([e.latitude, e.longitude]);
    markerGroup.addLayer(marker)
      .bindPopup('<h4>現在ここにいます。<h4><h4><a href="https://www.anzen.mofa.go.jp/trip/">くわしくはこちら</a></h4>')
      .openPopup();
    this.map.addLayer(markerGroup);
    this.map.setView(e.latlng);
  })

  .on('locationerror', (err) => {
    alert('現在地を取得できませんでした。GPS の設定を ON にしてください。');
    this.map.setView([35.3622222, 138.7313889], 5);
  })
  }
  loadmap() {
    if(this.plt.is('mobile')){
      this.ButtonLocation='end';
    }
    this.map =leaflet.map('map',{worldCopyJump: 'true',doubleClickZoom:false})
    map=this.map;
    legend.addTo(this.map);
    leaf.addTo(this.map);
    geo.addTo(this.map);
    this.getLocation()

  }
  onButtonClick(){
    this.getLocation();
  }

  closeWindow(){
    CountryInfo.remove();
    windowOn=true;
  }

  
}