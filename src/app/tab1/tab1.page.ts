import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, Config } from '@ionic/angular';
import leaflet from 'leaflet';

import { Observable, } from 'rxjs';
import * as Data from './custom.geo.json';
//jsonファイルより、国境、国の危険状態を取得
var worldBorder: Observable<any>=Data['features'];

//世界地図のデータを取得
var leaf=leaflet.tileLayer(`http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`, {
      attributions: 'Made by Kyhohei Oka',
      maxZoom: 20,
      minZoom: 2,
    })
// 地図に国の情報を地図に載せる

function highLight(e){
  var layer=e.target;
  layer.setStyle({
    weight:7,
    color:'#666',
    dashArray:'',
    fillOpacity:0.7
  });
  info.update(layer.feature.properties);
}

function onEachFeature(feature,layer){
  layer.on({
    mouseover: highLight,
    mouseout: resetHighLight,
  })
}

function resetHighLight(e){
  geo.resetStyle(e.target);
  info.update();
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
var info=leaflet.control();

info.onAdd=function(map){
  this._div=leaflet.DomUtil.create('div', 'infomation');
  this.update();
  return this._div;
}
info.update=function(props){
  this._div.innerHTML= '<h4>海外の危険状態</h4>' + (props ? '<b>' +
  props.name + '</b><br/>' + '危険度:' + props.security : '気になる国をクリックしてください。')
};

var legend=leaflet.control({position:'bottomright'});

legend.onAdd=function(map){
  var div=leaflet.DomUtil.create('div', 'infomation legend'),
  grades=[0,1,2,3,4],
  label=[];

  for(var i=0;i<grades.length;i++){
    div.innnerHTML+='<i style="background:'+getColor+'"></i>'
    +grades[i]+(grades[i+1]?'&ndash;'+grades[i+1]+'<br>':'&ndash;');}
  
  return div
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
  constructor(public navCtrl: NavController){}
  
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
    let circle:any= leaflet.circle(e.latlng,{
      radious: 50, 
      fillOpacity: 0.5, 
      color: 'blue', 
      fillColor: '#399ade'});

    let marker: any = leaflet.marker([e.latitude, e.longitude]);
    markerGroup.addLayer(marker)
      .addLayer(circle)
      .bindPopup('現在ここにいます。<br/>現在地：<strong id="your_country">日本</strong><br/>危険度：<strong id="your_score">2</strong><br/><a>くわしくはこちら</a>')
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
    this.map =leaflet.map('map',{worldCopyJump: 'true'});
    leaf.addTo(this.map);
    geo.addTo(this.map);
    info.addTo(this.map);
    legend.addTo(this.map);
    
    this.getLocation()
  }
  onButtonClick(){
    this.getLocation();
  }
}
