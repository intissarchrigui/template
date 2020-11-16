import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders,HttpRequest} from '@angular/common/http';


const host = 'http://localhost:8000';
@Injectable({
  providedIn: 'root'
})
export class ListMemberService {


  constructor(private http: HttpClient) { }


getAllmembers() {
    return this.http.get(host +'/api/ListMember');
 }
 //getMember
 getMember(id) {
  return this.http.get(host +'/api/detailsMember/'+id);
}

AddMember(obj) {
  return this.http.post(host +'/api/AddMember',obj);
}
deleteMember(id) {

  return this.http.get(host +'/api/deleteMember/'+id);
}
updateMember(currentMember) {

  return this.http.post(host +'/api/UpdateMember',currentMember);
}

}
