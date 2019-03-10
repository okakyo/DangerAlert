import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from '@ionic/angular';
import leaflet from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Geolocation , Geoposition } from '@ionic-native/geolocation';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page {
  @ViewChild('map') mapContainer: ElementRef;
  map: any;
  constructor(public navCtrl: NavController, public http: HttpClient){}

  ionViewDidEnter() {
    this.loadmap();
  }
  style(featur) {
    return {
      fillColor: '#FFEDA0',
      weight: 2,
      ocpacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7

    }
  }
  getColor(d){
    return d>1000 ? '':
           d>500 ? '':
           d>200 ? '':
           d>100 ? '':
           d>50 ? '':
           d>20 ? '':
           d>10 ? '':
                  '';
  }
  loadmap() {
    let worldBorder: Observable<any>;
    worldBorder = this.http.get('custom.geo.json')['features'];
    this.map = leaflet.map('map').fitWorld();
    leaflet.tileLayer(`http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`, {
      attributions: 'www.tphangout.com',
      maxZoom: 18
    }).addTo(this.map);
    leaflet.geoJson(worldBorder, {style: this.style}).addTo(this.map);
    this.map.locate({
      setView: true,
      maxZoom: 20
    }).on('locationfound', (e) => {
  let markerGroup = leaflet.featureGroup();
  let marker: any = leaflet.marker([e.latitude, e.longitude]).on('click', () => {
    alert('Marker clicked');
  })
  markerGroup.addLayer(marker);
  this.map.addLayer(markerGroup);
  }).on('locationerror', (err) => {
    alert(err.message);
})
}
}