import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetInfoService {

  constructor(public http:HttpClient) {}
  
  getMapData(){
    return this.http.get('https://www.travel-advisory.info/api').subscribe(res=>res.json());
  }
}