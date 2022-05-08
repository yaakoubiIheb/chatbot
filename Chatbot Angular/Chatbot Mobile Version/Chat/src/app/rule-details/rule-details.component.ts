import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Function } from '../classes/Function';
import { Rule } from '../classes/Rule';
import { Task } from '../classes/Task';
import { DeleteRuleComponent } from '../delete-rule/delete-rule.component';
import { FunctionRuleService } from '../services/function-rule.service';
import { RuleService } from '../services/rule.service';

@Component({
  selector: 'app-rule-details',
  templateUrl: './rule-details.component.html',
  styleUrls: ['./rule-details.component.scss']
})
export class RuleDetailsComponent implements OnInit {
  task : any;
  functions : Function[];
  step = -1;
  ruleTitle:string;
  constructor(
  private ruleService:RuleService,
  private functionRuleService : FunctionRuleService,
  private dialog: MatDialog,
  private activatedroute: ActivatedRoute) { }

  getTask(title:string){
    this.ruleService.getTaskbyTitle(title).subscribe(
      (data:any)=>{
        this.task = data;
        console.log(this.task);
        this.getTaskFunctions(this.task.id);
      },(error)=>console.log(error)
    )
  }

  getTaskFunctions(ruleId:number){
    this.functionRuleService.getAllRuleFunctions(ruleId).subscribe(
      (data:Function[])=>{this.functions = data;},error=>console.log(error)
    )
  }

  openDeleteTaskDialog(task: Task) {
    let deleteTaskDialog = this.dialog.open(DeleteRuleComponent, { data: { rule:task } })
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
    this.ruleTitle = this.activatedroute.snapshot.paramMap.get("ruleTitle");
    this.getTask(this.ruleTitle);
  }

}
