import { Injectable } from '@angular/core';
import { Permission } from '../classes/Permission';
import { User } from '../classes/User';

const TOKEN_KEY = 'auth-token';
const CHATBOT_TOKEN_KEY = 'chatbot-auth-token';
const USER_KEY = 'auth-user';
const PERMISSION_KEY = 'auth-permission';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  isLoggedIn : boolean = !!this.getToken();

  constructor() { }
  signOut(): void {
    window.sessionStorage.clear();
    this.isLoggedIn = !!this.getToken();
  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
    this.isLoggedIn = !!this.getToken();
  }
  public getToken(): string | null {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }

  public saveChatbotToken(token: string): void {
    window.sessionStorage.removeItem(CHATBOT_TOKEN_KEY);
    window.sessionStorage.setItem(CHATBOT_TOKEN_KEY, token);
  }
  public getChatbotToken(): string | null {
    return window.sessionStorage.getItem(CHATBOT_TOKEN_KEY);
  }



  public saveUser(user: User): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): User {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return null!;
  }

  public savePermission(permission: Permission): void {
    window.sessionStorage.removeItem(PERMISSION_KEY);
    window.sessionStorage.setItem(PERMISSION_KEY, JSON.stringify(permission));
  }

  public getPermission(): Permission {
    const permission = window.sessionStorage.getItem(PERMISSION_KEY);
    if (permission) {
      return JSON.parse(permission);
    }
    return null!;
  }
}
