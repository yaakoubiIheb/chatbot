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
  selector: 'app-add-conversation',
  templateUrl: './add-conversation.component.html',
  styleUrls: ['./add-conversation.component.scss']
})
export class AddConversationComponent implements OnInit {

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
  selection = new SelectionModel<Function>(true, []);
  constructor(
    private ruleService: RuleService,
    private _snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private chatbotService: ChatService,
    private functionService: FunctionService,
    private functionRuleService: FunctionRuleService,
    private route : Router) { }

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
  addTrigger() {
    let control = <FormArray>this.triggersFormGroup.controls["triggers"];
    control.push(this.initTrigger());
  }
  removeResponse(i: number) {
    let control = <FormArray>this.responsesFormGroup.controls["responses"];
    control.removeAt(i);
  }
  addResponse() {
    let control = <FormArray>this.responsesFormGroup.controls["responses"];
    control.push(this.initResponse());
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

  addConversation(conversation: Conversation, chatbotConversation: ChatbotRule) {
    this.loading = true;
    this.chatbotService.addRuleToChatbot(chatbotConversation).subscribe(
      (data: any) => {
        this.ruleService.insertConversation(conversation).subscribe(
          (data: string) => {
            this.openSnackBar(data);
            let functionsIds: number[] = [];
            for (let s of this.selection.selected) {
              functionsIds.push(s.id);
            }
            this.ruleService.getRuleByTitle(conversation.title).subscribe(
              (data: Rule) => {
                let functionRule = new Function_Rule(data.id, functionsIds);
                this.insertRuleFunctions(functionRule);
              }
            )
          }, error => {console.log(error);this.loading = false}
        )
      },error => {
        console.log(error);
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

  initOptions() {
    return this.formBuilder.group({
      option: ["", Validators.required],
      optionAttribute: ["", Validators.required]
    })
  }

  initTrigger() {
    return this.formBuilder.group({
      message: [""],
    })
  }
  initResponse() {
    return this.formBuilder.group({
      response: [""],
    })
  }


  insertRuleFunctions(functionRule: Function_Rule) {
    this.functionRuleService.insertRuleFunctions(functionRule).subscribe(
      (data:string) => {
        this.loading = false;
        this.route.navigate(['/regles']);
      },error=> {console.log(error);this.loading=false;}
    )
  }
  onSubmit() {
    let chatbotConversation: ChatbotRule = new ChatbotRule();
    let conversation: Conversation = new Rule();
    conversation.ruleType = "Conversation";
    chatbotConversation.type = "Conversation";
    conversation.title = this.titleFormGroup.value['title'];
    chatbotConversation.tag = this.titleFormGroup.value['title'];
    conversation.description = this.titleFormGroup.value['description']??"";
    chatbotConversation.description = this.titleFormGroup.value['description']??"";
    chatbotConversation.trigger = [];
    conversation.triggers = [];
    let triggersControl = <FormArray>this.triggersFormGroup.controls["triggers"];
    for (let t of triggersControl.controls) {
      conversation.triggers.push(new Trigger(-1, t.value['message']));
      chatbotConversation.trigger.push(t.value['message']);
    }
    let responsesControl = <FormArray>this.responsesFormGroup.controls["responses"];
    chatbotConversation.responses = [];
    conversation.conversationResponses = [];
    for (let r of responsesControl.controls) {
      conversation.conversationResponses.push(new ConversationResponse(-1,r.value['response']));
      chatbotConversation.responses.push(r.value['response']);
    }
    this.addConversation(conversation,chatbotConversation);
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
        if (this.titleExist) {
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
    this.getAllFunctions();

    this.titleFormGroup = this.formBuilder.group({
      title: [""],
      description : [""]
    }, { validator: this.confirmTitle("title") })

    this.triggersFormGroup = this.formBuilder.group({
      triggers: this.formBuilder.array([this.initTrigger()])
    })

    this.responsesFormGroup = this.formBuilder.group({
      responses: this.formBuilder.array([this.initResponse()])
    })
  }

}
