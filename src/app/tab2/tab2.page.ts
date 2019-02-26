
import { Component } from '@angular/core';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  News = [
    {id: '1', title: 'マリオ', datetime: ''},
    {id: '5', title: 'ルイージ', datetime: ''},
    {id: '4', title: 'ピーチ', datetime: ''},
    {id: '3', title: 'キノピオ', datetime: ''},
    {id: '2', title: 'クッパ', datetime: ''}
  ];
}
