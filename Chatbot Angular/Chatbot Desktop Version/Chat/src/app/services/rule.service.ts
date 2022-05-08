import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Conversation } from '../classes/Conversation';
import { Task } from '../classes/Task';
import { ConversationDetailsComponent } from '../conversation-details/conversation-details.component';
import { RuleDetailsComponent } from '../rule-details/rule-details.component';
import { Connection } from '../../../Connection/Connection';


const RULE_URL = Connection.BackendUrl+'RuleService.svc/';
const CONVERSATION_URL = Connection.BackendUrl+'ConversationService.svc/';
const TASK_URL = Connection.BackendUrl+'TaskService.svc/'


@Injectable({
  providedIn: 'root'
})
export class RuleService {

  constructor(private http: HttpClient,private dialog: MatDialog) { }

  getAllConversations() {
    return this.http.get(CONVERSATION_URL + "getAllConversations");
  }
  getConversationByTitle(title: string) {
    return this.http.get(CONVERSATION_URL + "getConversationByTitle?title=" + title);
  }
  insertConversation(conversation: Conversation) {
    return this.http.post(CONVERSATION_URL + "insertConversation", conversation);
  }
  updateConversation(conversation: Conversation) {
    return this.http.put(CONVERSATION_URL + "updateConversation", conversation);
  }
  deleteConversation(id: number) {
    return this.http.get(CONVERSATION_URL + "deleteConversation?id=" + id);
  }
  getAllTasks() {
    return this.http.get(TASK_URL + "getAllTasks");
  }
  getTaskbyTitle(title: string) {
    return this.http.get(TASK_URL + "getTaskByTitle?title=" + title);
  }
  insertTask(task: Task) {
    return this.http.post(TASK_URL + "insertTask", task);
  }
  updateTask(task: Task) {
    return this.http.put(TASK_URL + "updateTask", task);
  }
  deleteTask(id: number) {
    return this.http.get(TASK_URL + "deleteTask?id=" + id);
  }
  ruleExist(title: string) {
    return this.http.get(RULE_URL + "ruleExist?title=" + title);
  }
  getRuleByTitle(title: string) {
    return this.http.get(RULE_URL + "getRuleByTitle?title=" + title);
  }

  getAllRulesByFunction(functionId: number) {
    return this.http.get(RULE_URL + "getAllRulesByFunction?functionId=" + functionId);
  }

  getAllRules() {
    return this.http.get(RULE_URL + "getAllRules");
  }
  autocomplete(message:string,functionId:number){
    return this.http.get(RULE_URL + "autocomplete?message="+message+"&functionId="+functionId);
  }
  canExecuteRule(functionId:number,ruleTitle:string){
    return this.http.get(RULE_URL + "canExecuteRule?functionId="+functionId+"&ruleTitle="+ruleTitle);
  }

  openConsultRuleDialog(title: string, ruleType: string) {
    if (ruleType == "Tache"){
      let taskDetailsDialog = this.dialog.open(RuleDetailsComponent, { data: { title: title } });
    }else{
      let conversationDetailsDialog = this.dialog.open(ConversationDetailsComponent, { data: { title: title } });
    }
  }
}
