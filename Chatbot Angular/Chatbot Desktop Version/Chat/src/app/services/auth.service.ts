import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Connection } from '../../../Connection/Connection';
import { Observable } from 'rxjs';
import { TokenStorageService } from './token-storage.service';

const AUTH_API = Connection.BackendUrl+"AuthService.svc/";
const CHATBOT_AUTH_API = Connection.ChatbotUrl;


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {

  constructor(private http:HttpClient,
    private tokenStorageService: TokenStorageService,
    private router:Router) { }
  login(username: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'signIn', {username,password}, httpOptions);
  }

  chatbotLogin(){
    return this.http.get(CHATBOT_AUTH_API + 'login', httpOptions);
  }

  canActivate():boolean{
    if (!this.tokenStorageService.isLoggedIn){
      this.router.navigate(['connecter']);
      return false;
    }
    return true;
  }
}
