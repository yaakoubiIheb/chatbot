import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Connection } from '../../../Connection/Connection';


const API_URL = Connection.BackendUrl+'TaskResponseTypeService.svc/';
@Injectable({
  providedIn: 'root'
})
export class TaskResponseTypeService {

  constructor(private http:HttpClient) { }

  getAllTaskResponseType():Observable<any>{
    return this.http.get(API_URL+"getAllTaskResponseType");
  }
}
