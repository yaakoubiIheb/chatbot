import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiAttribute } from '../classes/ApiAttribute';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http:HttpClient) { }

  convertToJson(attributes:ApiAttribute[]){
    let body = "{"; 
    for(let [i,a] of attributes.entries()){
      body = body + '"' +a.attribute+ '":';
      if(a.valueType = "single"){
        body = body + '"'+a.values[0]+'"'
      }else{
        body = body + "["
        for(let [i,v] of a.values.entries()){
          body = body + '"'+v+'"';
          if(i+1 != a.values.length)body = body + ",";
        }
        body = body + "]"
      }
      if(i+1 != attributes.length)body = body + ",";
    }
    body = body + "}";
    return JSON.parse(body);
  }
  executeTask(api:string,method:string,attributes?:ApiAttribute[]):Observable<any>{
    if(attributes){
      return this.http.request(method,api,{body:this.convertToJson(attributes)});
    }
    else return this.http.request(method,api);
  }
}
