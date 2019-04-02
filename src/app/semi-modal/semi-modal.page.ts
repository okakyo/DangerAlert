import { Component, OnInit } from '@angular/core';
import {ModalController, NavController} from '@ionic/angular';
@Component({
  selector: 'app-semi-modal',
  templateUrl: './semi-modal.page.html',
  styleUrls: ['./semi-modal.page.scss'],
})
export class SemiModalPage implements OnInit {
  Country:String;
  DangerLevel:number;
  NEWS: String;
   constructor(public modalCtrl: ModalController,public navCtrl:NavController) {}

  ngOnInit() {
    console.log(`${this.Country}:${this.DangerLevel}:${this.NEWS}`);
  }
  closeModal(){
    this.modalCtrl.dismiss();
  }

}
