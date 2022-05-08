import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Function_Rule } from '../classes/Function_Rule';
import { Connection } from '../../../Connection/Connection';


const FUNCTION_RULE_URL = Connection.BackendUrl+"Function_RuleService.svc/";
@Injectable({
  providedIn: 'root'
})
export class FunctionRuleService {

  constructor(private http:HttpClient) { }
  getAllRuleFunctions(ruleId:number){
    return this.http.get(FUNCTION_RULE_URL+"getAllRuleFunctions?ruleId="+ruleId);
  }
  getAllFunctionConversations(functionId:number){
    return this.http.get(FUNCTION_RULE_URL+"getAllFunctionConversations?functionId="+functionId);
  }
  getAllFunctionTasks(functionId:number){
    return this.http.get(FUNCTION_RULE_URL+"getAllFunctionTasks?functionId="+functionId);
  }
  insertRuleFunctions(functionRule:Function_Rule){
    return this.http.post(FUNCTION_RULE_URL+"insertRuleFunctions",functionRule);
  }
  updateRuleFunctions(functionRule:Function_Rule){
    return this.http.put(FUNCTION_RULE_URL+"updateRuleFunctions",functionRule);
  }
  deleteRuleFunctions(ruleId:number){
    return this.http.get(FUNCTION_RULE_URL+"deleteRuleFunctions?ruleId="+ruleId);
  }
  deleteFunctionrules(functionId:number){
    return this.http.get(FUNCTION_RULE_URL+"deleteFunctionRules?functionId="+functionId);
  }
}
