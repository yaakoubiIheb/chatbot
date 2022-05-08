import { OtherFunctionsService } from '../services/other-functions.service';
import { RuleService } from '../services/rule.service';
import { TokenStorageService } from '../services/token-storage.service';
import { UserService } from '../services/user.service';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Function } from '../classes/Function';
import { HistoryClass } from '../classes/History';
import { LocalRule } from '../classes/LocalData';
import { Permission } from '../classes/Permission';
import { Rule } from '../classes/Rule';
import { User } from '../classes/User';
import { FunctionService } from '../services/function.service';
import { HistoryService } from '../services/history.service';
import { LocalStorageService } from '../services/local-storage.service';

@Component({
  selector: 'app-user-history',
  templateUrl: './user-history.component.html',
  styleUrls: ['./user-history.component.scss'],
  providers: [DatePipe]
})
export class UserHistoryComponent implements OnInit {

  signedInUser : User;
  signedInUserPermission : Permission;
  history: HistoryClass[] = [];
  loading: boolean = true;
  months;
  selectedYear = new Date().getFullYear().toString();
  selectedMonth = ("0" + (new Date().getMonth() + 1)).slice(-2);
  daysChar: string[] = [];
  daysNum: string[] = [];
  selectedDay = ("0" + (new Date().getDate())).slice(-2);
  constructor(private userService: UserService,
    private historyService: HistoryService,
    private tokenStorageService:TokenStorageService,
    private datePipe: DatePipe,
    private localStrorageService: LocalStorageService,
    private ruleService: RuleService,
    private otherFunctionsService:OtherFunctionsService,
    private functionService:FunctionService) { }



  getUserHistory(userId: number) {
    let date = this.selectedDay + "/" + this.selectedMonth + "/" + this.selectedYear;
    this.loading = true;
    this.historyService.getUserHistory(userId, date).subscribe(
      (data: HistoryClass[]) => {
        this.history = data;
        this.loading = false;
      }, error => console.log(error)
    )
  }
  selectDay(num) {
    this.selectedDay = num;
  }

  getDaysInMonth(month, year) {
    if (month[0] == "0") month = month[1];
    month = parseInt(month) - 1;
    year = parseInt(year);
    let date = new Date(year, month, 1);
    this.daysChar = [];
    this.daysNum = [];
    while (date.getMonth() === month) {
      this.daysChar.push(new Date(date).toString().split(" ", 4)[0]);
      this.daysNum.push(new Date(date).toString().split(" ", 4)[2]);
      date.setDate(date.getDate() + 1);
    }
  }
  getRandomColor() {
    return this.otherFunctionsService.getRandomColor("0.3");
  }

  pinRule(title:string) {
    this.ruleService.getRuleByTitle(title).subscribe(
      (data:Rule)=>{
        let localRule = new LocalRule(data,this.signedInUser.username);
        this.localStrorageService.pinRule(localRule);
        this.otherFunctionsService.openSnackBar("Elément ajouté aux règles épinglées");
      }
    )
  }

  openRuleDetailsDialog(title:string){
    this.ruleService.getRuleByTitle(title).subscribe(
      (data:Rule)=>{
        this.ruleService.openConsultRuleDialog(title,data.ruleType);
      }
    )
  }

  openUserDetailsDialog(username:string){
    this.userService.openUserDetailsDialog(username);
  }

  deleteMessageHistory(id:number){
    this.loading = true;
    this.historyService.deleteUserHistory(id).subscribe(
      (data:string)=>{
        this.getUserHistory(this.signedInUser.id);
        this.loading = false;
        this.otherFunctionsService.openSnackBar(data);
      },
      error=>console.log(error)
    )
  }

  ngOnInit(): void {
    this.signedInUser = this.tokenStorageService.getUser();
    this.signedInUserPermission = this.tokenStorageService.getPermission();
    this.getUserHistory(this.signedInUser.id);
    this.getDaysInMonth(this.selectedMonth, this.selectedYear)
    this.months = this.historyService.months;
  }

}
