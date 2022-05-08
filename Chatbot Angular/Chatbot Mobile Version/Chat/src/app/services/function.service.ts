import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Function } from '../classes/Function';
import { Connection } from '../../../Connection/Connection';


const API_URL = Connection.BackendUrl+'FunctionService.svc/';

@Injectable({
  providedIn: 'root'
})
export class FunctionService {

  constructor(private http:HttpClient) { }

  getAllFunctions(): Observable<any>{
    return this.http.get(API_URL+"getAllFunction");
  }

  addFunction(func :Function ):Observable<any>{
    return this.http.post(API_URL+"insertFunction",func);
  }

  editFunction(func:Function):Observable<any>{
    return this.http.put(API_URL+"updateFunction",func);
  }

  deleteFunction(funct :Function):Observable<any>{
    return this.http.request('delete',API_URL+"deleteFunction",{body:funct});
  }
}
