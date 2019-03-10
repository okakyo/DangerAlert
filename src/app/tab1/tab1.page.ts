import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from '@ionic/angular';
import leaflet from 'leaflet';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page {
  @ViewChild('map') mapContainer: ElementRef;
  map: any;
  constructor(public navCtrl: NavController) {

  }

  ionViewDidEnter() {
    this.loadmap();
  }

  loadmap() {
    this.map = leaflet.map('map').fitWorld();
    leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attributions: 'www.tphangout.com',
      maxZoom: 18
    }).addTo(this.map);
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