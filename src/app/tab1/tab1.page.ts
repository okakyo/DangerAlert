import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, Config } from '@ionic/angular';
import leaflet from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Geolocation , Geoposition } from '@ionic-native/geolocation';
import * as Data from './custom.geo.json';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page {
  private headers:any=new Headers({'Connect-Type':'application/json'});
  @ViewChild('map') mapContainer: ElementRef;
  map: any;
  constructor(public navCtrl: NavController, public http: HttpClient){}

  ionViewDidEnter() {
    this.loadmap();
  }
  style(feature){
    return {
      fillColor: '#43FF6B',
      weight: 2,
      opacity: 0.5,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.5
    }
  }
  getColor(d){
    return d>4 ? '':
           d>3 ? '':
           d>2 ? '':
           d>1 ? '':
                 '#43FF6B';
  }
  loadmap() {

    let worldBorder: Observable<any>=Data['features'];
    this.http.get('https://www.travel-advisory.info/api', this.headers).subscribe((data:any)=>{
      console.log(data);
    },error=>{
      console.log(error);
    })
    this.map = leaflet.map('map').fitWorld();
    leaflet.tileLayer(`http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`, {
      attributions: 'Made by Kyhohei Oka',
      maxZoom: 20,
      minZoom: 5,
    }).addTo(this.map);
    
    //The setting of Choropleth Map
    leaflet.geoJson(worldBorder, {style: this.style}).addTo(this.map);
    console.log(worldBorder);

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
    markerGroup.addLayer(circle)
      .bindPopup('現在ここにいます。<br/>現在地：<strong>日本</strong><br/>危険度：<strong id="score">2</strong><br/><a>くわしくはこちら</a>')
      .openPopup();
    this.map.addLayer(markerGroup);})

  .on('locationerror', (err) => {
    alert(err.message);
})

}
}