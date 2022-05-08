import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Conversation } from '../classes/Conversation';
import { Function } from '../classes/Function';
import { DeleteConversationComponent } from '../delete-conversation/delete-conversation.component';
import { FunctionRuleService } from '../services/function-rule.service';
import { RuleService } from '../services/rule.service';

@Component({
  selector: 'app-conversation-details',
  templateUrl: './conversation-details.component.html',
  styleUrls: ['./conversation-details.component.scss']
})
export class ConversationDetailsComponent implements OnInit {

  conversation : Conversation;
  functions : Function[];
  step = -1;
  constructor(@Inject(MAT_DIALOG_DATA) public data: {title: string},
  private ruleService:RuleService,
  private functionRuleService : FunctionRuleService,
  private dialog: MatDialog) { }

  getConversation(title:string){
    this.ruleService.getConversationByTitle(title).subscribe(
      (data:Conversation)=>{
        this.conversation = data;
        this.getConversationFunctions(this.conversation.id);
      },(error)=>console.log(error)
    )
  }

  getConversationFunctions(ruleId:number){
    this.functionRuleService.getAllRuleFunctions(ruleId).subscribe(
      (data:Function[])=>{this.functions = data;console.log(this.functions)},error=>console.log(error)
    )
  }
  openDeleteConversationDialog(conversation: Conversation) {
    let deleteTaskDialog = this.dialog.open(DeleteConversationComponent, { data: { rule:conversation } })
  }


  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }
  ngOnInit(): void {
    this.getConversation(this.data.title);
  }

}
