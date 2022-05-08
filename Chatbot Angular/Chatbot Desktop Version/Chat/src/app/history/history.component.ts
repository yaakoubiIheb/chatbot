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
import { OtherFunctionsService } from '../services/other-functions.service';
import { RuleService } from '../services/rule.service';
import { TokenStorageService } from '../services/token-storage.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
  providers: [DatePipe]
})
export class HistoryComponent implements OnInit {

  signedInUser : User;
  signedInUserPermission : Permission;
  users: User[] = [];
  userFunctions : Function[] = [];
  userSelected = -1;
  history: HistoryClass[] = [];
  loading: boolean = true;
  filteredUsers: User[] = [];
  avatarColors: string[] = [];
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

  getAllUsers() {
    this.userService.getAllEmployees().subscribe(
      (data: User[]) => {
        this.users = data;
        for (let u of this.users){
          this.avatarColors.push(this.getRandomColor());
          this.getUserFunction(u.id);
        }
        this.filteredUsers = data;
      },
      error => console.log(error)
    )
  }

  getUserById(id){
    for(let u of this.users){
      if(u.id == id)return u;
    }
    return null
  }

  getUserFunction(id:number){
    this.userService.getEmployeeFunction(id).subscribe(
      (data:Function)=>this.userFunctions.push(data)
      ,error=>console.log(error)
    )
  }
  selectDay(num) {
    this.selectedDay = num;
  }

  getUserHistory(userId: number, date: string) {
    this.loading = true;
    this.historyService.getUserHistory(userId, date).subscribe(
      (data: HistoryClass[]) => {
        this.history = data;
        this.loading = false;
      }, error => console.log(error)
    )
  }

  getAllUsersHistory(date: string) {
    this.loading = true;
    this.historyService.getAllUsersHistory(date).subscribe(
      (data: HistoryClass[]) => {
        this.history = data;
        this.loading = false;
      }, error => console.log(error)
    )
  }

  applyFilter(val: string) {
    this.filteredUsers = this.users.filter((u) => {
      let fullName = (u.name).concat(" " + u.lastname);
      return (fullName.toLowerCase().includes((val).toLowerCase()))
    })
  }

  getHistory() {
    let date = this.selectedDay + "/" + this.selectedMonth + "/" + this.selectedYear;
    if (this.userSelected == -1) {
      this.getAllUsersHistory(date);
    } else {
      this.getUserHistory(this.userSelected, date);
    }
    console.log();
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
        this.getHistory();
        this.loading = false;
        this.otherFunctionsService.openSnackBar(data);
      },
      error=>console.log(error)
    )
  }

  ngOnInit(): void {
    this.signedInUser = this.tokenStorageService.getUser();
    this.signedInUserPermission = this.tokenStorageService.getPermission();
    this.getAllUsers();
    this.getAllUsersHistory(this.datePipe.transform(new Date(), 'dd/MM/yyyy'));
    this.getDaysInMonth(this.selectedMonth, this.selectedYear)
    this.months = this.historyService.months;
  }

}
