import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders,HttpRequest} from '@angular/common/http';
const host = 'http://localhost:8000';
@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http: HttpClient) { }


  postdemand() {

    return this.http.post(host +'/api/register');
  }
}
