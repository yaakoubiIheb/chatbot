import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HistoryClass } from '../classes/History';
import { User } from '../classes/User';
import { Connection } from '../../../Connection/Connection';


const API_URL = Connection.BackendUrl+'HistoryService.svc/';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  constructor(private http:HttpClient) { }

  months = [
    {
    "name": "Janvier",
    "number": "01",
    "days": 31
  },
  {
    "name": "Février",
    "number": "02",
    "days": 28
  },
  {
    "name": "Mars",
    "number": "03",
    "days": 31
  },
  {
    "name": "Avril",
    "number": "04",
    "days": 30
  },
  {
    "name": "Mai",
    "number": "05",
    "days": 31
  },
  {
    "name": "Juin",
    "number": "06",
    "days": 30
  },
  {
    "name": "Juillet",
    "number": "07",
    "days": 31
  },
  {
    "name": "Aout",
    "number": "08",
    "days": 31
  },
  {
    "name": "Septembre",
    "number": "09",
    "days": 30
  },
  {
    "name": "Octobre",
    "number": "10",
    "days": 31
  },
  {
    "name": "Novembre",
    "number": "11",
    "days": 30
  },
  {
    "name": "Decembre",
    "number": "12",
    "days": 31
  }
]
  getUserHistory(userId:number,date:string): Observable<any>{
    return this.http.get(API_URL+"getUserHistory?userId="+userId+"&date="+date);
  }

  getAllUsersHistory(date:string):Observable<any>{
    return this.http.get(API_URL+"getAllUsersHistory?date="+date);
  }
  addUserHistory(history:HistoryClass): Observable<any>{
    console.log(history);
    return this.http.post(API_URL+"insertHistory",history);
  }

  deleteAllUserHistory(username:string): Observable<any>{
    return this.http.get(API_URL+"deleteAllUserHistory?username="+username);
  }

  deleteUserHistory(historyId:number): Observable<any>{
    return this.http.get(API_URL+"deleteHistoryById?historyId="+historyId);
  }
}
