import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Rule } from '../classes/Rule';
import { ConversationDetailsComponent } from '../conversation-details/conversation-details.component';
import { DeleteConversationComponent } from '../delete-conversation/delete-conversation.component';
import { DeleteRuleComponent } from '../delete-rule/delete-rule.component';
import { RuleDetailsComponent } from '../rule-details/rule-details.component';
import { RuleService } from '../services/rule.service';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss'],
})
export class RulesComponent implements OnInit {
  rules: Rule[] = [];
  displayedColumns: string[] = [];
  dataSource!: MatTableDataSource<Rule>;
  tableLoaded: boolean = false;
  value = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<any>;
  constructor(private ruleService: RuleService,
    private dialog: MatDialog,
    private router:Router) { }

  getAllConversations() {
    this.ruleService.getAllConversations().subscribe(
      data => {}, error => console.log(error)
    )
  }
  getAllRules() {
    this.ruleService.getAllConversations().subscribe(
      (data: Rule[]) => {
        let conversations = data;
        this.ruleService.getAllTasks().subscribe(
          (data: Rule[]) => {
            let tasks = data;
            this.rules = conversations.concat(tasks);
            this.shuffle(this.rules);
            this.dataSource = new MatTableDataSource(this.rules);
            this.displayedColumns.push("title");
            this.displayedColumns.push("ruleType");
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.tableLoaded = true;
          }, error => console.log(error)
        )
      }, error => console.log(error)
    )
  }
  /*renderTableRows() {
    this.ruleService.getAllRules().subscribe(
      (data: Rule[]) => {
        this.rules = data;
        this.dataSource.data = this.rules;
        this.table.renderRows();
      }, (error: any) => { console.log(error); })
  }*/
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  updateRule(title:string,ruleType:string){
    if(ruleType == "Conversation")this.router.navigate(['regles/modifierConversation',title]);
    else this.router.navigate(['regles/modifierTache',title])
  }

  deleteRule(rule:Rule){
    if(rule.ruleType == "Conversation")this.openDeleteConversationDialog(rule);
    else this.openDeleteTaskDialog(rule);
  }
  openTaskDetailsDialog(title: string) {
    let taskDetailsDialog = this.dialog.open(RuleDetailsComponent, { data: { title: title } });
  }
  openConversationDetailsDialog(title:string){
    let conversationDetailsDialog = this.dialog.open(ConversationDetailsComponent, { data: { title: title } });
  }

  openDetailsDialog(title:string,ruleType:string){
    if(ruleType=="Tache"){
      this.router.navigate(['consulter tache',title]);
      //this.openTaskDetailsDialog(title);
    }
    else{
      this.router.navigate(['consulter conversation',title]);
    } //this.openConversationDetailsDialog(title);
  }

  openDeleteTaskDialog(rule: Rule) {
    let deleteTaskDialog = this.dialog.open(DeleteRuleComponent, { data: { rule:rule } })
  }

  openDeleteConversationDialog(rule: Rule){
    let deleteConversationDialog = this.dialog.open(DeleteConversationComponent, { data: { rule: rule } })
  }

  shuffle(array) {
    var currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }
 
  ngOnInit(): void {
    this.getAllRules();
  }

}
