import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Connection } from '../../../Connection/Connection';

const BACKEND_URL = Connection.BackendUrl+'StatisticsService.svc/';
@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  constructor(private http: HttpClient) { }
  getNumberOfUsers():Observable<any>{
    return this.http.get(BACKEND_URL + "getNumberOfUsers");
  }

  getNumberOfConversations():Observable<any>{
    return this.http.get(BACKEND_URL + "getNumberOfConversations");
  }

  getNumberOfTasks():Observable<any>{
    return this.http.get(BACKEND_URL + "getNumberOfTasks");
  }

  getNumberOfFunctions():Observable<any>{
    return this.http.get(BACKEND_URL + "getNumberOfFunctions");
  }

  getTotalNumberOfMessages():Observable<any>{
    return this.http.get(BACKEND_URL + "getTotalNumberOfMessages");
  }

  getNumberOfMissedMessages():Observable<any>{
    return this.http.get(BACKEND_URL + "getNumberOfMissedMessages");
  }

  getAllMissedMessages():Observable<any>{
    return this.http.get(BACKEND_URL + "getAllMissedMessages");
  }

  getMostExecutedConversations():Observable<any>{
    return this.http.get(BACKEND_URL + "getMostExecutedConversations");
  }

  getMostExecutedTasks():Observable<any>{
    return this.http.get(BACKEND_URL + "getMostExecutedTasks");
  }

  getNumberOfMessagesPerDate():Observable<any>{
    return this.http.get(BACKEND_URL + "getNumberOfMessagesPerDate");
  }

  getNumberOfMessagesPerFunctionAndDate():Observable<any>{
    return this.http.get(BACKEND_URL + "getNumberOfMessagesPerFunctionAndDate");
  }

  
  getNumberOfMessagesPerFunction():Observable<any>{
    return this.http.get(BACKEND_URL + "getNumberOfMessagesPerFunction");
  }
}
