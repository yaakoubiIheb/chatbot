import { HttpClient, JsonpClientBackend } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatbotRule } from '../classes/ChatbotRule';
import { Message } from '../classes/Message';
import { Rule } from '../classes/Rule';
import { Task } from '../classes/Task';
import { Connection } from '../../../Connection/Connection';

const USER_CHAT = 'user-chat';

@Injectable({
  providedIn: 'root'
})
export class ChatService{
  endpoint : string =  Connection.ChatbotUrl;

  constructor(private http:HttpClient) { }

  saveChat(messages : Message[]){
    window.sessionStorage.removeItem(USER_CHAT);
    window.sessionStorage.setItem(USER_CHAT,JSON.stringify(messages));
  }

  getChat():Message[]{
    let messages:  Message[] = JSON.parse(window.sessionStorage.getItem(USER_CHAT)!)
    if(messages == null)messages = [];
    return messages;   
  }
  getResponse(message:string):Observable<any>{
    return this.http.get(this.endpoint+"chatRes/"+message);
  }
  addRuleToChatbot(rule:ChatbotRule):Observable<any>{
    return this.http.post(this.endpoint+"addRule",rule);
  }
  updateChatbotRule(rule:ChatbotRule):Observable<any>{
    return this.http.put(this.endpoint+"modifyRule",rule);
  }
  deleteChatbotRule(title:string):Observable<any>{
    return this.http.delete(this.endpoint+"deleteRule/"+title);
  }

  taskCall(api:string,method:string,attributes?:string[]):Observable<any>{
    switch(method){
      case "post":{
        return this.http.post(api,attributes);
      }
      case "put":{
        return this.http.put(api,attributes);
      }
      case "delete":{
        return this.http.delete(api);
      }
      default:{
        return this.http.get(api);
      }
    }
  }


}
