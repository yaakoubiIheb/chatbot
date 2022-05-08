import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { User } from '../classes/User';
import { DeleteUserComponent } from '../delete-user/delete-user.component';
import { UserDetailsComponent } from '../user-details/user-details.component';
import { Connection } from '../../../Connection/Connection';


const API_URL = Connection.BackendUrl+'UserService.svc/';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http:HttpClient,private dialog: MatDialog) { }
  getAllEmployees(): Observable<any>{
    return this.http.get(API_URL+"getAllEmployees");
  }

  userExist(username:string): Observable<any>{
    return this.http.get(API_URL+"userExistByUsername?username="+username);
  }
  getEmployeeByUsername(username:string):Observable<any>{
    return this.http.get(API_URL+"getEmployeeByUsername?username="+username);
  }
  getEmployeeById(id:number):Observable<any>{
    return this.http.get(API_URL+"getEmployeeById?id="+id)
  }
  getEmployeeFunction(id:number):Observable<any>{
    return this.http.get(API_URL+"getEmployeeFunction?id="+id);
  }
  addEmployee(user:User):Observable<any>{
    return this.http.post(API_URL+"insertEmployee",user);
  }
  deleteEmployee(user:User):Observable<any>{
    return this.http.request('delete',API_URL+"deleteUser",{body:user});
  }
  updateEmployee(user:User):Observable<any>{
    return this.http.put(API_URL+"updateEmployee",user);
  }
  openUserDetailsDialog(username:string){
    let userDetailsDialog = this.dialog.open(UserDetailsComponent, {data: { username: username }});
  }
}
