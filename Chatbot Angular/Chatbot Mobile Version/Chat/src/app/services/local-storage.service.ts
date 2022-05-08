import { Injectable } from '@angular/core';
import { LocalTask,LocalRule } from '../classes/LocalData';
import { Rule } from '../classes/Rule';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor(private tokenStorageService:TokenStorageService) { }

  saveLocalTasks(data:LocalTask[]){
    localStorage.setItem("ExecutedTasks",JSON.stringify(data));
  }

  saveLocalTask(task:LocalTask){
    this.removeLocalTask(task.ruleTitle,task.username);
    let tasks : LocalTask[] =  this.getLocalTasks() ?? [];
    tasks.push(task);
    this.saveLocalTasks(tasks);
  }
  getLocalTasks(username?:string):LocalTask[]{
    if(username){
      let tasks : LocalTask[] = JSON.parse(localStorage.getItem("ExecutedTasks")) ?? [];
      let userTasks : LocalTask[] = [];
      for(let t of tasks)if(t.username == username)userTasks.push(t);
      return userTasks;
    }else {
      return JSON.parse(localStorage.getItem("ExecutedTasks")) ?? [];
    }
  }
  removeLocalTask(ruleTitle:string,username:string){
    let tasks:LocalTask[] = this.getLocalTasks() ?? [];
    let position = -1;
    for(let i = 0;i<tasks.length;i++){
      if(tasks[i].username == username && tasks[i].ruleTitle == ruleTitle){
        position = i;
        break;
      }
    }
    if(position != -1)tasks.splice(position,1);
    this.saveLocalTasks(tasks);
  }

  pinRule(rule:LocalRule){
    this.removePinnedRule(rule.rule.title,rule.username);
    let rules : LocalRule[] =  this.getPinnedRules() ?? [];
    rules.push(rule);
    this.savePinnedRules(rules);
  }
  savePinnedRules(rules:LocalRule[]){
    localStorage.setItem("PinnedRules",JSON.stringify(rules)); 
  }

  getPinnedRules(username?:string):LocalRule[]{
    if(username){
      let rules : LocalRule[] = JSON.parse(localStorage.getItem("PinnedRules")) ?? [];
      let userRules = [];
      for(let r of rules)if(r.username == this.tokenStorageService.getUser().username)userRules.push(r);
      return userRules;
    }else {
      return JSON.parse(localStorage.getItem("PinnedRules")) ?? [];
    }
  }

  removePinnedRule(ruleTitle:string,username:string){
    let rules:LocalRule[] = this.getPinnedRules() ?? [];
    let position = -1;
    for(let i = 0;i<rules.length;i++){
      if(rules[i].username == username && (rules[i].rule).title == ruleTitle){
        position = i;
        break;
      }
    }
    if(position != -1)rules.splice(position,1);
    this.savePinnedRules(rules);
  }
}
