import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Rule } from '../classes/Rule';
import { Trigger } from '../classes/Trigger';
import { RuleService } from '../services/rule.service';
import { TaskResponseTypeService } from '../services/task-response-type.service';
import { Task } from '../classes/Task';
import { ChatService } from '../services/chat.service';
import { ChatbotRule } from '../classes/ChatbotRule';
import { TaskService } from '../services/task.service';
import { Chart} from '../classes/Chart';
import { Function } from '../classes/Function';
import { FunctionService } from '../services/function.service';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { TaskDetailComponent } from '../task-detail/task-detail.component';
import { Option } from '../classes/Option';
import { Input } from '../classes/Input';
import { ChatbotSequenceMessage } from '../classes/ChatbotSequenceMessage';
import { OptionMessage } from '../classes/OptionMessage';
import { ChatbotOption } from '../classes/ChatbotOption';
import { FunctionRuleService } from '../services/function-rule.service';
import { Function_Rule } from '../classes/Function_Rule';

@Component({
  selector: 'app-edit-rule',
  templateUrl: './edit-rule.component.html',
  styleUrls: ['./edit-rule.component.scss']
})
export class EditRuleComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<any>;
  step = -1;
  taskTitle: string;
  taskToEdit : Task = new Task();
  isEditable = true;
  hasAttributes: boolean = false;
  sequenceMessagesFormGroup: FormGroup;
  titleFormGroup: FormGroup;
  apiFormGroup: FormGroup;
  triggersFormGroup: FormGroup;
  loading: boolean = false;
  functions: Function[] = [];
  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<Function>;
  value = '';
  titleExist: boolean = false;
  selection;
  constructor(private activatedroute: ActivatedRoute,
    private ruleService: RuleService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private chatbotService: ChatService,
    private taskService: TaskService,
    private functionService: FunctionService,
    private functionRuleService: FunctionRuleService,
    private route:Router) { }

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
  getTaskByTitle(title:string){
    this.ruleService.getTaskbyTitle(title).subscribe(
      (data:Task)=>{
        this.taskToEdit = data;
        this.getRuleFunctions(this.taskToEdit.id);
        this.titleFormGroup.get("title").setValue(this.taskToEdit.title);
        this.titleFormGroup.get("description").setValue(this.taskToEdit.description);
        for(let t of this.taskToEdit.triggers){
          this.addTrigger(t.id,t.message,t.ruleId);
        }
        this.apiFormGroup.get("api").setValue(this.taskToEdit.api);
        this.apiFormGroup.get("method").setValue(this.taskToEdit.method);
        this.apiFormGroup.get("responseType").setValue(this.taskToEdit.responseType);
        if(this.taskToEdit.sequenceMessages.length != 0)this.apiFormGroup.get("hasAttributes").setValue("true");
        this.apiFormGroup.get("graphType").setValue(this.taskToEdit.graphType);
        for(let [i, t] of this.taskToEdit.sequenceMessages.entries()){
          if(t.sequenceType == "saisie"){
            let input = t as Input;
            this.addSequenceMessage(input.id,input.question,input.attribute,input.sequenceType,input.valueType,input.controlType,input.ruleId);
          }else{
            let options = t as Option;
            this.addSequenceMessage(options.id,options.question,options.attribute,options.sequenceType,"unique","texte",options.ruleId);
            for(let o of options.optionMessages){
              this.addOption(i,o.id,o.message,o.value,o.optionId);
            }     
          }
        }
        this.sequenceValidators();
      },error=>console.log(error)
    )
  }
  addTrigger(id?:number,trigger?:string,ruleId?:number) {
    let control = <FormArray>this.triggersFormGroup.controls["triggers"];
    control.push(this.initTrigger(id,trigger,ruleId));
  }
  removeTrigger(i: number) {
    let control = <FormArray>this.triggersFormGroup.controls["triggers"];
    control.removeAt(i);
  }
  addSequenceMessage(id?:number,question?:string,attribute?:string,sequenceType?:string,valueType?:string,controlType?:string,ruleId?:number) {
    let control = <FormArray>this.sequenceMessagesFormGroup.controls["sequences"];
    control.push(this.initSequenceMessage(id,question,attribute,sequenceType,valueType,controlType,ruleId));
  }
  addNewSequenceMessage() {
    let control = <FormArray>this.sequenceMessagesFormGroup.controls["sequences"];
    control.push(this.initNewSequenceMessage());
  }
  removeSequenceMessage(i: number) {
    let control = <FormArray>this.sequenceMessagesFormGroup.controls["sequences"];
    control.removeAt(i);
  }
  addNewOption(index: number) {
    let control = (<FormArray>this.sequenceMessagesFormGroup.controls["sequences"]).at(index).get("options") as FormArray;
    control.push(this.initNewOptions());
  }
  initNewOptions() {
    return this.formBuilder.group({
      option: ["", Validators.required],
      optionAttribute: ["", Validators.required]
    })
  }
  addOption(sequenceIndex?: number,id?:number,message?:string,value?:string,optionId?:number) {
    let control = (<FormArray>this.sequenceMessagesFormGroup.controls["sequences"]).at(sequenceIndex).get("options") as FormArray;
    control.push(this.initOptions(id,message,value,optionId));
  }
  removeOption(sequenceIndex: number, optionsIndex: number) {
    console.log(optionsIndex);
    let control = (<FormArray>this.sequenceMessagesFormGroup.controls["sequences"]).at(sequenceIndex).get("options") as FormArray;
    control.removeAt(optionsIndex);
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

  updateTask(task: Task) {
    this.ruleService.updateTask(task).subscribe(
      (data: string) => {
        this.openSnackBar(data);
        let functionsIds: number[] = [];
        for (let s of this.selection.selected) {
          functionsIds.push(s.id);
        }
        this.ruleService.getRuleByTitle(task.title).subscribe(
          (data:Rule)=>{
            let functionRule= new Function_Rule(data.id,functionsIds);
            this.updateRuleFunctions(functionRule);
          },error=>{this.loading = false;this.openSnackBar("Erreur")}
        )
      }, error => {console.log(error);this.openSnackBar("Erreur");this.loading = false}
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

  initSequenceMessage(id?:number,question?:string,attribute?:string,sequenceType?:string,valueType?:string,controlType?:string,ruleId?:number) {
    return this.formBuilder.group({
      id : [id],
      message: [question],
      sequenceAttribute: [attribute],
      sequenceType: [sequenceType],
      valueType: [valueType],
      controlType:[controlType],
      options: this.formBuilder.array([]),
      ruleId : [ruleId]
    })
  }

  initNewSequenceMessage() {
    return this.formBuilder.group({
      message: [""],
      sequenceAttribute: [""],
      sequenceType: ["saisie"],
      valueType: ["unique"],
      controlType:["texte"],
      options: this.formBuilder.array([this.initNewOptions(), this.initNewOptions()])
    })
  }


  initOptions(id?:number,message?:string,value?:string,optionId?:number) {
    return this.formBuilder.group({
      id:[id],
      option: [message, Validators.required],
      optionAttribute: [value, Validators.required],
      optionId : [optionId]
    })
  }

  initTrigger(id?:number,trigger?:string,ruleId?:number) {
    return this.formBuilder.group({
      id :[id],
      message: [trigger],
      ruleId:[ruleId]
    })
  }

  updateChatbotTask(task: Task, chatbotRule: ChatbotRule) {
    this.loading = true;
    this.chatbotService.updateChatbotRule(chatbotRule).subscribe(
      (data: any) => {
        this.updateTask(task);
      },
      error => {
        console.log(error);
        this.openSnackBar("Erreur")
        this.loading = false;
      }
    )
  }

  sequenceValidators() {
    let sequencesControl = <FormArray>this.sequenceMessagesFormGroup.controls["sequences"];
    for (let s of sequencesControl.controls) {
      let sequenceType = s.value['sequenceType'];
      let optionsControl = s.get("options") as FormArray;
      if (sequenceType === "saisie") {
        for (let o of optionsControl.controls) {
          o.get("option").setValidators(null);
          o.get("optionAttribute").setValidators(null);
          o.get("option").updateValueAndValidity();
          o.get("optionAttribute").updateValueAndValidity();
        }
      } else if (sequenceType === "options") {
        for (let o of optionsControl.controls) {
          o.get("option").setValidators([Validators.required]);
          o.get("optionAttribute").setValidators([Validators.required]);
          o.get("option").updateValueAndValidity();
          o.get("optionAttribute").updateValueAndValidity();
        }
      }
    }
  }
  updateRuleFunctions(functionRule: Function_Rule) {
    this.loading = false;
    this.functionRuleService.updateRuleFunctions(functionRule).subscribe(
      data =>{
        this.loading = false;
    this.route.navigate(['/regles']);
      },error=> {this.loading = false;this.openSnackBar("Erreur")}
    )
  }
  onSubmit() {
    let chatbotTask: ChatbotRule = new ChatbotRule();
    let taskBeingAdded: Task = new Rule();
    taskBeingAdded.id = this.taskToEdit.id;
    taskBeingAdded.ruleType = "Tache";
    chatbotTask.type = "Tache";
    taskBeingAdded.title = this.taskToEdit.title;
    taskBeingAdded.description = this.titleFormGroup.value['description']??"";
    chatbotTask.tag = this.taskToEdit.title;
    chatbotTask.description = this.titleFormGroup.value['description']??"";
    chatbotTask.trigger = [];
    taskBeingAdded.triggers = [];
    let triggersControl = <FormArray>this.triggersFormGroup.controls["triggers"];
    for (let t of triggersControl.controls) {
      taskBeingAdded.triggers.push(new Trigger(t.value['id']??-1, t.value['message'],this.taskToEdit.id));
      chatbotTask.trigger.push(t.value['message']);
    }
    taskBeingAdded.api = this.apiFormGroup.value['api'];
    chatbotTask.api = this.apiFormGroup.value['api'];
    taskBeingAdded.method = this.apiFormGroup.value['method'];
    chatbotTask.methode = this.apiFormGroup.value['method'];
    taskBeingAdded.graphType = this.apiFormGroup.value['graphType'];
    chatbotTask.graphType = this.apiFormGroup.value['graphType'];
    taskBeingAdded.responseType = this.apiFormGroup.value['responseType'];
    chatbotTask.responseType = this.apiFormGroup.value['responseType'];

    if (this.apiFormGroup.value['hasAttributes']) {
      chatbotTask.sequence = [];
      taskBeingAdded.sequenceMessages = [];
      let sequencesControl = <FormArray>this.sequenceMessagesFormGroup.controls["sequences"];
      for (let s of sequencesControl.controls) {
        let options: OptionMessage[] = [];
        let chatbotOptions: ChatbotOption[] = [];
        if (s.value['sequenceType'] == "options") {
          let optionsControl = s.get("options") as FormArray;
          for (let o of optionsControl.controls) {
            options.push(new OptionMessage(o.value['id']??-1, o.value['option'], o.value['optionAttribute'],o.value['optionId']??-1));
            chatbotOptions.push(new ChatbotOption(o.value['option'], o.value['optionAttribute']));
          }
          taskBeingAdded.sequenceMessages.push(new Option(s.value['id']??-1,s.value['message'],s.value['sequenceAttribute'], s.value['sequenceType'], s.value['ruleId']??-1, options));
        } else {
          taskBeingAdded.sequenceMessages.push(new Input(s.value['id']??-1,s.value['message'],s.value['sequenceAttribute'], s.value['sequenceType'],s.value['ruleId']??-1,  s.value['valueType'],s.value['controlType']));
        }
        chatbotTask.sequence.push(new ChatbotSequenceMessage(s.value['message'],s.value['sequenceAttribute'],s.value['sequenceType'], chatbotOptions,  s.value['valueType'],s.value['controlType']));
      }
    }else{
      chatbotTask.sequence = null;
      taskBeingAdded.sequenceMessages = null
    }
    this.updateChatbotTask(taskBeingAdded,chatbotTask);
  }
  executeTask(api: string, method: string, responseType: string) {
    this.taskService.executeTask(api, method).subscribe(
      (data) => {
        if (responseType == "statistique") {
          let chart = new Chart();
          chart.dataSets = data.dataSets;
          chart.labels = data.labels;
          chart.type = this.apiFormGroup.value['graphType'];
          this.openTaskDetailDialog(chart, responseType);
        } else if (responseType == "matrice") {
          this.openTaskDetailDialog(data, responseType);
        }
      }, error => console.log(error)
    )
  }

  openTaskDetailDialog(data: any, responseType: string) {
    let taskDetailDialog = this.dialog.open(TaskDetailComponent, { data: { data: data, responseType: responseType } })
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
        if (this.titleExist && title!= this.taskTitle) {
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
    this.taskTitle = this.activatedroute.snapshot.paramMap.get("ruleTitle");
    this.getTaskByTitle(this.taskTitle);
    this.getAllFunctions();
    this.sequenceMessagesFormGroup = this.formBuilder.group({
      sequences: this.formBuilder.array([])
    });

    this.titleFormGroup = this.formBuilder.group({
      title: [{value:"",disabled:true}],
      description:[""]
    }, { validator: this.confirmTitle("title") })

    this.apiFormGroup = this.formBuilder.group({
      api: [""],
      method: ["GET"],
      responseType: ["aucun"],
      hasAttributes: ["false"],
      graphType: ["line"]
    })

    this.triggersFormGroup = this.formBuilder.group({
      triggers: this.formBuilder.array([])
    })

    this.sequenceValidators();
  }

}
