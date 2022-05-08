import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as Chart from 'chart.js';
import { ApiAttribute } from '../classes/ApiAttribute';
import { LocalRule,LocalTask } from '../classes/LocalData';
import { User } from '../classes/User';
import { LocalStorageService } from '../services/local-storage.service';
import { RuleService } from '../services/rule.service';
import { TaskService } from '../services/task.service';
import { TokenStorageService } from '../services/token-storage.service';
import { TaskDetailComponent } from '../task-detail/task-detail.component';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
  localTasks: LocalTask[] = [];
  signedInUser : User;
  constructor(private taskService: TaskService,
    public localStorageService: LocalStorageService,
    private dialog: MatDialog,
    private tokenStorageService:TokenStorageService) { }

  executeTask(api: string, method: string, apiAttributes?: ApiAttribute[]) {
    this.taskService.convertToJson(apiAttributes);
  }
  openTaskDetailDialog(data: any, responseType: string) {
    let taskDetailsDialog = this.dialog.open(TaskDetailComponent, { data: { data: data, responseType: responseType } });
  }
  getLocalTasks(username) {
    this.localTasks = this.localStorageService.getLocalTasks(username) ?? [];
    let options: any = {
      legend: {
        display: true,
      },
      elements: {
        point:{
            radius: 0
        }
    },
      scales: {
        xAxes: [{
          gridLines: {
            display : false
          },
          ticks: {
            display: true
          }
        }],
        yAxes: [{
          gridLines: {
            display : false
          },
          ticks: {
            display: true
          }
        }]
      }
    }
    for (let d of this.localTasks) {
      if (d.type == "statistique") d.data["options"] = options;
    }
  }
  deleteFromLocalTasks(ruleTitle:string){
    this.localStorageService.removeLocalTask(ruleTitle,this.signedInUser.username);
    this.getLocalTasks(this.signedInUser.username);
  }

  ngOnInit(): void {
    this.signedInUser = this.tokenStorageService.getUser();
    this.getLocalTasks(this.signedInUser.username);
  }

}
