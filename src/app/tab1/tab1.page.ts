import { Component, OnInit  } from '@angular/core';
import { Platform } from '@ionic/angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  Marker,
  LocationService,
  GoogleMapsAnimation,
  MyLocation,
  GoogleMapOptions
} from '@ionic-native/google-maps';
@Component({

  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page implements OnInit {
  map: GoogleMap;
  
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
    LocationService.getMyLocation().then((location: MyLocation)=>{
    let options: GoogleMapOptions={
      camera: {
        target: location.latLng,
        zoom: 17,
        tilt: 30
      }
    }
    // Googleマップを作成
    this.map = GoogleMaps.create('map_canvas',options);

    let marker: Marker = this.map.addMarkerSync({
      position: location.latLng,
      animation: GoogleMapsAnimation.BOUNCE
    });

    // 情報ウィンドウの表示
    marker.showInfoWindow();
  })
}

  // ボタンが押された時の処理
  onButtonClick() {

    // 現在位置を取得
    this.map.getMyLocation().then((location: MyLocation) => {
      // アニメーションで指定の位置にズームイン 
      this.map.animateCamera({
        target: location.latLng,
        zoom: 17,
        tilt: 30
      });

      // アニメーションが終了したらマーカーを追加
      let marker: Marker = this.map.addMarkerSync({
        position: location.latLng,
        animation: GoogleMapsAnimation.BOUNCE
      });

      // 情報ウィンドウの表示
      marker.showInfoWindow();

      // もし情報ウィンドウがクリックされたら、アラートを表示
      marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
        alert('clicked!');
      })
    })
    .catch(err => {
      // getMyLocationでエラーが発生したら、メッセージを表示
      alert(err.error_message);
    });
  }
}