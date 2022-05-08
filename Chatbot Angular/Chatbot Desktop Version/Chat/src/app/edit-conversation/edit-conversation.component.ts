import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Rule } from '../classes/Rule';
import { Trigger } from '../classes/Trigger';
import { RuleService } from '../services/rule.service';
import { TaskResponseTypeService } from '../services/task-response-type.service';
import { ChatService } from '../services/chat.service';
import { ChatbotRule } from '../classes/ChatbotRule';
import { TaskService } from '../services/task.service';
import { Function } from '../classes/Function';
import { FunctionService } from '../services/function.service';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { FunctionRuleService } from '../services/function-rule.service';
import { Function_Rule } from '../classes/Function_Rule';
import { Conversation } from '../classes/Conversation';
import { ConversationResponse } from '../classes/ConversationResponse';
@Component({
  selector: 'app-edit-conversation',
  templateUrl: './edit-conversation.component.html',
  styleUrls: ['./edit-conversation.component.scss']
})
export class EditConversationComponent implements OnInit {

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<any>;
  step = -1;
  isEditable = true;
  titleFormGroup: FormGroup;
  triggersFormGroup: FormGroup;
  responsesFormGroup: FormGroup;
  loading: boolean = false;
  functions: Function[] = [];
  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<Function>;
  titleExist: boolean = false;
  selection;
  conversationTitle : string;
  conversationToEdit:Conversation;
  constructor(private activatedroute: ActivatedRoute,
    private ruleService: RuleService,
    private _snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private chatbotService: ChatService,
    private functionService: FunctionService,
    private functionRuleService: FunctionRuleService,
    private route:Router) { }

    functionIsSelected(functionId){
      let exist : boolean = false;
      for(let f of this.selection.selected){
        if(functionId == f.id)exist = true;
      }
      return exist;
    }
    getRuleFunctions(ruleId){
      this.functionRuleService.getAllRuleFunctions(ruleId).subscribe(
        (data:Function[])=>{
          this.selection = new SelectionModel<Function>(true,data);
        },error=>console.log(error)
      )
    }
    getConversationByTitle(title:string){
      this.ruleService.getConversationByTitle(title).subscribe(
        (data:Conversation)=>{
          this.conversationToEdit = data;
          this.getRuleFunctions(this.conversationToEdit.id);
          this.titleFormGroup.get("title").setValue(this.conversationToEdit.title);
          this.titleFormGroup.get("description").setValue(this.conversationToEdit.description);
          for(let t of this.conversationToEdit.triggers){
            this.addTrigger(t.id,t.message,t.ruleId);
          }
          for(let r of this.conversationToEdit.conversationResponses){
            this.addResponse(r.id,r.response,r.conversationId);
          }

        },error=>console.log(error)
      )
    }

  getAllFunctions() {
    this.functionService.getAllFunctions().subscribe(
      (data: Function[]) => {
        this.functions = data;
        this.dataSource = new MatTableDataSource(this.functions);
        this.displayedColumns.push("select");
        this.displayedColumns.push("title");
        this.dataSource.sort = this.sort;
      },
      error => console.log(error)
    )
  }
  addTrigger(id?:number,trigger?:string,ruleId?:number) {
    let control = <FormArray>this.triggersFormGroup.controls["triggers"];
    control.push(this.initTrigger(id,trigger,ruleId));
  }
  removeResponse(i: number) {
    let control = <FormArray>this.responsesFormGroup.controls["responses"];
    control.removeAt(i);
  }
  addResponse(id?:number,response?:string,conversationId?:number) {
    let control = <FormArray>this.responsesFormGroup.controls["responses"];
    control.push(this.initResponse(id,response,conversationId));
  }
  removeTrigger(i: number) {
    let control = <FormArray>this.triggersFormGroup.controls["triggers"];
    control.removeAt(i);
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

  updateConversation(conversation: Conversation, chatbotConversation: ChatbotRule) {
    this.loading = true;
    this.chatbotService.updateChatbotRule(chatbotConversation).subscribe(
      (data: any) => {
        this.ruleService.updateConversation(conversation).subscribe(
          (data: string) => {
            this.openSnackBar(data);
            let functionsIds: number[] = [];
            for (let s of this.selection.selected) {
              functionsIds.push(s.id);
            }
            this.ruleService.getRuleByTitle(conversation.title).subscribe(
              (data: Rule) => {
                let functionRule = new Function_Rule(data.id, functionsIds);
                this.updateRuleFunctions(functionRule);
              }
            )
          }, error => {console.log(error);this.openSnackBar("Erreur");this.loading = false}
        )
      },error => {
        console.log(error);
        this.openSnackBar("Erreur")
        this.loading = false;
      }
    )
  }
  openSnackBar(message: string) {
    let horizontalPosition: MatSnackBarHorizontalPosition = 'end';
    let verticalPosition: MatSnackBarVerticalPosition = 'top';
    this._snackBar.open(message, 'Fermer', {
      duration: 2000,
      horizontalPosition: horizontalPosition,
      verticalPosition: verticalPosition,
    });
  }
  customTrackBy(index: number, obj: any): any {
    return index;
  }

  initTrigger(id?:number,trigger?:string,ruleId?:number) {
    return this.formBuilder.group({
      id : [id],
      message: [trigger],
      ruleId : [ruleId]
    })
  }
  initResponse(id?:number,response?:string,conversationId?:number) {
    return this.formBuilder.group({
      id : [id],
      response: [response],
      conversationId : [conversationId]
    })
  }


  updateRuleFunctions(functionRule: Function_Rule) {
    this.functionRuleService.updateRuleFunctions(functionRule).subscribe(
      data =>{
        this.loading = false;
        this.route.navigate(['/regles']);
      },error=>{this.loading=false;this.openSnackBar("Erreur")}
    )
  }
  onSubmit() {
    let chatbotConversation: ChatbotRule = new ChatbotRule();
    let conversation: Conversation = new Rule();
    conversation.id = this.conversationToEdit.id;
    conversation.ruleType = "Conversation";
    chatbotConversation.type = "Conversation";
    conversation.title = this.conversationToEdit.title;
    chatbotConversation.tag = this.conversationToEdit.title;
    conversation.description = this.titleFormGroup.value['description']??"";
    chatbotConversation.description = this.titleFormGroup.value['description']??"";
    chatbotConversation.trigger = [];
    conversation.triggers = [];
    let triggersControl = <FormArray>this.triggersFormGroup.controls["triggers"];
    for (let t of triggersControl.controls) {
      conversation.triggers.push(new Trigger(t.value['id']??-1,t.value['message'],t.value['ruleId']??-1));
      chatbotConversation.trigger.push(t.value['message']);
    }
    chatbotConversation.responses = [];
    conversation.conversationResponses = [];
    let responsesControl = <FormArray>this.responsesFormGroup.controls["responses"];
    conversation.conversationResponses = [];
    for (let r of responsesControl.controls) {
      conversation.conversationResponses.push(new ConversationResponse(r.value['id']??-1,r.value['response'],r.value['conversationId']??-1));
      chatbotConversation.responses.push(r.value['response']);
    }
    this.updateConversation(conversation,chatbotConversation);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Function): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.title + 1}`;
  }
  ruleExist(title: string, titleControl) {
    this.ruleService.ruleExist(title).subscribe(
      (data: boolean) => {
        this.titleExist = data
        if (titleControl.errors && !titleControl.errors.confirmedValidator) {
          return;
        }
        if (this.titleExist && title.toLowerCase() != this.conversationTitle.toLowerCase()) {
          titleControl.setErrors({ confirmedValidator: true });
        } else {
          titleControl.setErrors(null);
        }
      }, error => console.log(error)
    )
  }

  confirmTitle(title: string) {
    return (formGroup: FormGroup) => {
      const titleControl = formGroup.controls[title];
      this.ruleExist(titleControl.value, titleControl);
    }
  }
  ngOnInit(): void {
    this.conversationTitle = this.activatedroute.snapshot.paramMap.get("ruleTitle");
    this.getConversationByTitle(this.conversationTitle);
    this.getAllFunctions();

    this.titleFormGroup = this.formBuilder.group({
      title: [{value:"",disabled:true}],
      description : [""]
    }, { validator: this.confirmTitle("title") })

    this.triggersFormGroup = this.formBuilder.group({
      triggers: this.formBuilder.array([])
    })

    this.responsesFormGroup = this.formBuilder.group({
      responses: this.formBuilder.array([])
    })
  }
}
