import { Component, OnInit  } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Map, latLng, tileLayer, marker } from 'leaflet';
@Component({

  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page implements OnInit {
  map: Map;
  
  // このHomePageクラスが作成されるときに実行される
  constructor(private platform: Platform){
  }

  // ngOnInitは、AngularJSの準備が完了したら実行される
  async ngOnInit() {
    // Apache Cordovaから 'deviceready'イベントが発行されるのを待つ
    await this.platform.ready();

    // platform.ready()が完了したら、地図を作成する
    await this.loadMap();
  }

  async loadMap() {
}

  // ボタンが押された時の処理
  onButtonClick() {

    // 現在位置を取得
}