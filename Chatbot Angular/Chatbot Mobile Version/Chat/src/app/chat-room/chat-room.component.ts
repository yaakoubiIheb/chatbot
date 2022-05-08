import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApiAttribute } from '../classes/ApiAttribute';
import { ChatbotRule } from '../classes/ChatbotRule';
import { Message } from '../classes/Message';
import { ChatbotSequenceMessage } from '../classes/ChatbotSequenceMessage';
import { User } from '../classes/User';
import { ChatService } from '../services/chat.service';
import { TaskService } from '../services/task.service';
import { TokenStorageService } from '../services/token-storage.service';
import { TaskDetailComponent } from '../task-detail/task-detail.component';
import { Chart } from '../classes/Chart';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { HistoryService } from '../services/history.service';
import { DatePipe } from '@angular/common';
import { HistoryClass } from '../classes/History';
import { LocalStorageService } from '../services/local-storage.service';
import { LocalTask, LocalRule } from '../classes/LocalData';
import { RuleDetailsComponent } from '../rule-details/rule-details.component';
import { ConversationDetailsComponent } from '../conversation-details/conversation-details.component';
import { OtherFunctionsService } from '../services/other-functions.service';
import { RuleService } from '../services/rule.service';
import { Rule } from '../classes/Rule';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';
import { Function } from '../classes/Function';
import { Permission } from '../classes/Permission';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss'],
  providers: [DatePipe]

})
export class ChatRoomComponent implements OnInit {
  @ViewChild('chatSpaceContainer', { static: false }) chatSpaceContainer!: ElementRef;
  @ViewChild('chatSpace') chatSpace!: ElementRef;
  loadingAutocomplete : boolean = false;
  loading: boolean = false;
  messages: Message[] = [];
  inSequence: boolean = false;
  sequenceIndex: number;
  rule: ChatbotRule = new ChatbotRule();
  rules: Rule[] = [];
  filteredRules: Rule[] = [];
  apiAttributes: ApiAttribute[] = [];
  localRules: LocalRule[] = [];
  avatarColor: string;
  signedInUser: User;
  signedInUserPermission : Permission;
  userFunction: Function = new Function();
  inputType = "text";
  inputDisable: boolean = false;
  inMultipleMessages: boolean = false;
  inputMaxLength = "";
  inputPattern = "";
  inputMaxNumber = "";
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });


  constructor(private chatService: ChatService,
    private tokenStorageService: TokenStorageService,
    private taskService: TaskService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private historyService: HistoryService,
    private datePipe: DatePipe,
    private localStorageService: LocalStorageService,
    private otherFunctionsService: OtherFunctionsService,
    private ruleService: RuleService,
    private userService: UserService) { }

  /*canExecute(rule: ChatbotRule) {
    let canExecute: boolean = false;
    for (let r of this.rules) {
      if (r.title == rule.tag) canExecute = true;
    }
    if(rule.tag == "pas de reponse")canExecute = true;
    console.log(rule.tag);
    return canExecute;
  }*/
  /*getAllRulesFunction(functionId) {
    this.ruleService.getAllRulesByFunction(functionId).subscribe(
      (data: Rule[]) => {
        this.rules = data;
      }
    )
  }*/
  /*getAllRules(){
    this.ruleService.getAllRules().subscribe(
      (data:Rule[])=>this.rules=data,error=>console.log(error)
    )
  }*/
  getUserFunction(userId: number) {
    this.userService.getEmployeeFunction(userId).subscribe(
      (data: Function) => {
        this.userFunction = data;
        //this.getAllRulesFunction(this.userFunction.id);
      },
      error => console.log(error)
    )
  }
  autocomplete(form: NgForm) {
    this.ruleService.autocomplete(form.value['message'],this.userFunction.id).subscribe(
      (data:Rule[])=>{this.rules = data}
    )
    /*if(this.rules){
      this.filteredRules = this.rules.filter((r) => {
        for (let t of r.triggers) {
          return (t.message.toLowerCase().includes((form.value['message']).toLowerCase()))
        }
        return null;
      })
    }*/
  }
  applyFilter(val: string) {

  }
  filterRules(value: string): Rule[] {
    let filterValue = value.toLowerCase();

    return this.rules.filter(rule => rule.title.toLowerCase().indexOf(filterValue) === 0);
  }
  addHistory(history: HistoryClass) {
    this.historyService.addUserHistory(history).subscribe();
  }
  onSubmit(form: NgForm) {
    let message: string;
    if (this.inputType == 'date') {
      message = this.datePipe.transform(form.value['message'], 'dd/MM/yyyy');
    }
    else {
      message = form.value['message'];
    }
    form.reset();
    if (message != "" && message != null) {
      this.addMessage(message, "user", "message");
      this.loading = true;
      if (!this.inSequence) {
        this.getResponse(message)
      }
      else {
        this.loading = false;
        this.apiAttributes[this.apiAttributes.length - 1].values.push(message);
        if (this.apiAttributes[this.apiAttributes.length - 1].valueType != "multiple") {
          this.inMultipleMessages = false;
          this.nextSequenceMessage();
        } else { this.inMultipleMessages = true }
      }
    }
  }
  getResponse(message: string) {
    this.loading = true;
    this.chatService.getResponse(message).subscribe(
      (data: any) => {
        this.rule = data.data;
        this.ruleService.canExecuteRule(this.userFunction.id,this.rule.tag).subscribe(
          (data:boolean)=>{
            console.log(data);
            if (!data) {
              this.addMessage("vous n'avez pas l'autorisation d'exécuter cette règle", "chatbot", "message");
              this.loading = false;
              this.resetChatbot();
             }
           else {
             this.addHistory((
               new HistoryClass(-1,
                 message,
                 this.datePipe.transform(new Date(), 'dd/MM/yyyy HH:mm'),
                 this.signedInUser.id,
                 this.rule.tag)));
             if (this.rule.type == "Conversation") {
               this.getChatbotConversationResponse(this.rule);
             } else {
               this.getChatbotTaskResponse(this.rule);
             }
             this.chatService.saveChat(this.messages);
           }
          },error=>{
            this.addMessage("Chatbot indisponible", "chatbot", "message");
            this.resetChatbot();
          }
        )
      }, (error: any) => {
        console.log(error);
        this.addMessage("Chatbot indisponible", "chatbot", "message");
        this.resetChatbot();
        this.chatService.saveChat(this.messages);
      });

  }

  scrollToBottom() {
    let el: HTMLDivElement = this.chatSpaceContainer.nativeElement;
    setTimeout(() => el.scrollTop = Math.max(0, el.scrollHeight + 300));
  }

  getChatbotConversationResponse(rule: ChatbotRule) {
    let response = rule.responses[Math.floor(Math.random() * rule.responses.length)];
    let responses = response.split(";");
    for (let m of responses) {
      this.addMessage(m, "chatbot", "message");
    }
    this.loading = false;
  }

  getChatbotTaskResponse(rule: ChatbotRule) {
    if (rule.sequence == null) {
      this.excuteTask(this.rule);
    } else {
      this.inSequence = true;
      this.sequenceIndex = -1;
      this.nextSequenceMessage();
    }
  }

  nextSequenceMessage() {
    this.resetInput();
    if (this.sequenceIndex + 1 == this.rule.sequence.length) {
      this.inSequence = false;
      this.excuteTask(this.rule, this.apiAttributes);
    } else {
      this.sequenceIndex++;
      let sequence: ChatbotSequenceMessage = this.rule.sequence[this.sequenceIndex];
      this.apiAttributes.push(new ApiAttribute(sequence.attribute, [], sequence.valueType))
      this.selectInputType(sequence.controlType);
      this.addMessage(sequence.question, "chatbot", "question");
      if (sequence.sequenceType == "options") {
        this.inputDisable = true;
        for (let o of sequence.options) {
          this.addMessage(o.message, "chatbot", "option", o.value);
        }
      }
    }
    this.loading = false;
  }
  addAttribute(option, value) {
    this.inputDisable = false;
    if (this.inSequence) {
      this.apiAttributes[this.apiAttributes.length - 1].values.push(value);
      this.removeOptions();
      this.addMessage(option, "user", "message");
      this.nextSequenceMessage();
    }
  }

  removeOptions() {
    let optionIndexes: number[] = []
    for (let i = 0; i < this.messages.length; i++) {
      if (this.messages[i].type == "option") optionIndexes.push(i);
    }
    this.messages.splice(optionIndexes[0], optionIndexes.length);
  }

  addMessage(message: string, sender: string, type: string, optionValue?: string) {
    this.messages.push(new Message(message, sender, type, this.datePipe.transform(new Date(), "HH:mm"), optionValue));
    this.chatService.saveChat(this.messages);
    let el: HTMLDivElement = this.chatSpaceContainer.nativeElement;
    setTimeout(() => el.scrollTop = Math.max(0, el.scrollHeight + 300));
  }

  excuteTask(rule: ChatbotRule, apiAttributes?: ApiAttribute[]) {
    this.loading = true;
    this.taskService.executeTask(rule.api, rule.methode, apiAttributes).subscribe(
      (data: any) => {
        if (rule.responseType == "valeur") {
          this.addMessage(data, "chatbot", "message");
        } else if (rule.responseType == "statistique") {
          let chart = new Chart();
          chart.dataSets = data.dataSets;
          chart.labels = data.labels;
          chart.type = rule.graphType;
          this.localStorageService.saveLocalTask(new LocalTask(chart, "statistique", this.signedInUser.username, rule.tag, this.datePipe.transform(new Date(), 'dd/MM/yyyy HH:mm')));
          this.openTaskDetailDialog(chart, rule.responseType);
        } else if (rule.responseType == "matrice") {
          if(Array.isArray(data))this.localStorageService.saveLocalTask(new LocalTask(data, "matrice", this.signedInUser.username, rule.tag, this.datePipe.transform(new Date(), 'dd/MM/yyyy HH:mm')));
          this.openTaskDetailDialog(data, rule.responseType);
        }
        this.loading = false;
        this.openSnackBar("Tache exécuté avec succée");
        this.apiAttributes = [];
      }
      , (error) => {
        console.log(error);
        this.apiAttributes = [];
        this.loading = false;
        this.addMessage("Erreur de connexion","chatbot","message")
      }
    );
  }

  openTaskDetailDialog(data: any, responseType: string) {
    let taskDetailsDialog = this.dialog.open(TaskDetailComponent, { data: { data: data, responseType: responseType } });
  }

  resetInput() {
    this.inputType = "text";
    this.inputDisable = false;
    this.inputMaxLength = "";
    this.inputPattern = "";
    this.inputMaxNumber = "";
  }
  selectInputType(type: string) {
    this.resetInput();
    switch (type) {
      case "texte": this.inputType = "text";
        break;
      case "texte1": this.inputMaxLength = "1";
        break;
      case "texte10": this.inputMaxLength = "10";
        break;
      case "texte50": this.inputMaxLength = "50";
        break;
      case "numero": this.inputType = "number";
        break;
      case "mot de passe": this.inputType = "password";
        break;
      case "date": this.inputType = "date";
        break;
      case "email": this.inputType = "email"; this.inputPattern = "[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$";
        break;
      default: this.inputType = "text";
    }
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

  getRandomColor() {
    let trans = '0.2';
    let color = 'rgba(';
    for (let i = 0; i < 3; i++) {
      color += Math.floor(Math.random() * 255) + ',';
    }
    color += trans + ')';
    return color;
  }

  getDate() {
    return new Date();
  }

  openTaskDetailsDialog(title: string) {
    let taskDetailsDialog = this.dialog.open(RuleDetailsComponent, { data: { title: title } });
  }
  openConversationDetailsDialog(title: string) {
    let conversationDetailsDialog = this.dialog.open(ConversationDetailsComponent, { data: { title: title } });
  }

  openDetailsDialog(title: string, ruleType: string) {
    if (ruleType == "Tache") this.openTaskDetailsDialog(title);
    else this.openConversationDetailsDialog(title);
  }

  resetChatbot() {
    this.loading = false;
    this.inSequence = false;
    this.resetInput();
    this.removeOptions();
    this.apiAttributes = [];
    this.inMultipleMessages = false;
  }
  executeRule(trigger: string) {
    this.resetChatbot();
    this.addMessage(trigger, "user", "message");
    this.getResponse(trigger);
  }

  removePinnedRule(ruleTitle: string, username: string) {
    this.localStorageService.removePinnedRule(ruleTitle, username);
    this.localRules = this.localStorageService.getPinnedRules(this.signedInUser.username) ?? [];
    this.otherFunctionsService.openSnackBar("Règle retirée de la liste");
  }
  ngOnInit(): void {
    this.signedInUser = this.tokenStorageService.getUser();
    this.signedInUserPermission = this.tokenStorageService.getPermission();
    this.messages = this.chatService.getChat();
    this.removeOptions();
    if (this.signedInUser.userType == "Employe") {
      this.getUserFunction(this.signedInUser.id);
    } else {
      this.userFunction.id = -1;
    }
    /*if (this.signedInUser.userType == "Employe") {
      this.getUserFunction(this.signedInUser.id);
    } else {
      this.getAllRules();
    }*/
    this.localRules = this.localStorageService.getPinnedRules(this.signedInUser.username) ?? [];
  }
}
