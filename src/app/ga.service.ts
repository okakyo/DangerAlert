import { Injectable } from '@angular/core';

declare let gtag:any;
@Injectable({
  providedIn: 'root'
})
export class GaService {

  constructor() { }

  private useGA():boolean{
    return typeof gtag!==undefined;
  }
  sendPageView(url:string):void{
    if(!this.useGA()){return;}
    gtag('config','UA-137860602-1',{
      'page-path':url
    });
  }
  sendEvent(eventName:string,eventCategory:string,eventAction:string,eventLabel:any):void{
    if(!this.useGA()){
      return;    }
    gtag('event',eventName,{
      event_category:eventCategory,
      event_action:eventAction,
      event_label:eventLabel
    });
  }
}
