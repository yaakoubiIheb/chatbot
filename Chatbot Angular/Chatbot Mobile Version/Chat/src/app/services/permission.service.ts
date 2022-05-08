import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Connection } from '../../../Connection/Connection';


const API_URL = Connection.BackendUrl+'PermissionService.svc/';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  constructor(private http: HttpClient) { }
  getAllPermissions():Observable<any>{
    return this.http.get(API_URL+"getAllPermission");
  }

  getPermissionById(id:number):Observable<any>{
    return this.http.get(API_URL+"getPermissionById?id="+id);
  }
  
}
