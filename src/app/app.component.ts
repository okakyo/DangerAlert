import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router,NavigationEnd } from '@angular/router';
import { GaService } from './ga.service';
import { filter } from 'rxjs/operators';

declare let ga: Function;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router:Router,
    private gaService :GaService
    
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.router.events
      .pipe(
       filter(e=>e instanceof NavigationEnd))
      .subscribe((params: any)=>{
        this.gaService.sendPageView(params.url);
      });
      
    });
  }
}
