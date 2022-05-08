import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Chart } from '../classes/Chart';
import { HistoryClass } from '../classes/History';
import { StatisticsService } from '../services/statistics.service';
import { TaskDetailComponent } from '../task-detail/task-detail.component';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<any>;

  nbrUsers : number;
  nbrConversations : number;
  nbrTasks : number;
  nbrFunctions : number;
  totalNbrMessages : number;
  nbrMissedMessages : number;
  missedMessages : HistoryClass[] = [];
  mostExecutedConversations : Chart;
  mostExecutedTasks : Chart;
  messagesPerDate : Chart;
  messagesPerFunctionAndDate : Chart;
  messagesPerFunction : Chart;
  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<HistoryClass>;
  
  constructor(private statisticsService : StatisticsService,private dialog: MatDialog) { }

  getNbrUsers(){
    return this.statisticsService.getNumberOfUsers().subscribe(data=>this.nbrUsers = data)
  }

  getNbrConversations(){
    return this.statisticsService.getNumberOfConversations().subscribe(data=>this.nbrConversations = data)
  }
  getNbrTasks(){
    return this.statisticsService.getNumberOfTasks().subscribe(data=>this.nbrTasks = data)
  }
  getNbrFunctions(){
    return this.statisticsService.getNumberOfFunctions().subscribe(data=>this.nbrFunctions = data)
  }
  getTotalNbrMessages(){
    return this.statisticsService.getTotalNumberOfMessages().subscribe(data=>this.totalNbrMessages = data)
  }
  getNbrMissedMessages(){
    return this.statisticsService.getNumberOfMissedMessages().subscribe(data=>this.nbrMissedMessages = data)
  }
  getMissedMessages(){
    return this.statisticsService.getAllMissedMessages().subscribe(
      (data:HistoryClass[])=>{
        this.missedMessages = data;
        this.dataSource = new MatTableDataSource(this.missedMessages);
        this.displayedColumns.push("message");
        this.dataSource.sort = this.sort;
      }
    )
  }
  getMostExecutedConversations(){
    return this.statisticsService.getMostExecutedConversations().subscribe(data=>{
      this.mostExecutedConversations = data;
      this.mostExecutedConversations.options = { legend: { display: true, responsive : true,maintainAspectRatio:false}};
    })
  }
  getMostExecutedTasks(){
    return this.statisticsService.getMostExecutedTasks().subscribe(data=>{
      this.mostExecutedTasks = data;
      this.mostExecutedTasks.options = { legend: { display: true, responsive : true,maintainAspectRatio:false}};

    })
  }
  getMessagesPerDate(){
    return this.statisticsService.getNumberOfMessagesPerDate().subscribe(data=>{
      this.messagesPerDate = data;
      this.messagesPerDate.options = { legend: { display: true, responsive : true,maintainAspectRatio:false}};
    })
  }
  getMessagesPerFunctionAndDate(){
    return this.statisticsService.getNumberOfMessagesPerFunctionAndDate().subscribe(data=>{
      this.messagesPerFunctionAndDate = data;
      this.messagesPerFunctionAndDate.options = { legend: { display: true, responsive : true,maintainAspectRatio:false}};
    })
  }
  getMessagesPerFunction(){
    return this.statisticsService.getNumberOfMessagesPerFunction().subscribe(data=>{
      this.messagesPerFunction = data;
      this.messagesPerFunction.options = { legend: { display: true, responsive : true,maintainAspectRatio:false}};
      console.log(this.messagesPerFunction);
    })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  openTaskDetailDialog(data: any, responseType: string) {
    let taskDetailsDialog = this.dialog.open(TaskDetailComponent, { data: { data: data, responseType: responseType } });
  }

  ngOnInit(): void {
    this.getNbrUsers();
    this.getNbrConversations();
    this.getNbrTasks();
    this.getNbrFunctions();
    this.getTotalNbrMessages();
    this.getNbrMissedMessages();
    this.getMissedMessages();
    this.getMostExecutedConversations();
    this.getMostExecutedTasks();
    this.getMessagesPerDate();
    this.getMessagesPerFunctionAndDate();
    this.getMessagesPerFunction();
  }

}
