import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, Config } from '@ionic/angular';
import leaflet from 'leaflet';

import { Observable, } from 'rxjs';
import * as Data from './custom.geo.json';

var worldBorder: Observable<any>=Data['features'];
var leaf=leaflet.tileLayer(`http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`, {
      attributions: 'Made by Kyhohei Oka',
      maxZoom: 20,
      minZoom: 2,
    })
var geo=leaflet.geoJson(worldBorder, {style:　style, onEachFeature: onEachFeature});
function highLight(e){
  var layer=e.target;

  layer.setStyle({
    weight:7,
    color:'#666',
    dashArray:'',
    fillOpacity:0.7
  });
}

function onEachFeature(feature,layer){
  layer.on({
    mouseover: highLight,
    mouseout: resetHighLight,
  })
}

function resetHighLight(e){
  geo.resetStyle(e.target);
}

function style(feature){
    var d:number= feature.properties.security;
    return {
      fillColor:  d>4 ? 'red' :d>3 ? 'orange': d>2 ? 'yellow' : d>=1 ? '#43FF6B': 'grey' ,
      weight: 5,
      opacity: 0.5,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.5
    }
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
    this.getLocation()
  }
  onButtonClick(){
    this.getLocation();
  }
}
