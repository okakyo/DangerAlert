import { Component } from '@angular/core';
import {GoogleAnalytics} from '@ionic-native/google-analytics';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private ga:GoogleAnalytics,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.ga.StartTrackerWithId('').then(()=>{
        console.log('Google Analytics is ready now');
        this.ga.trackView('test');
      }).catch(e=>{
        console.log('Error starting GoogleAnalytics',e);
      })
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
