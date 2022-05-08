import { Token } from '@angular/compiler/src/ml_parser/lexer';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Rule } from '../classes/Rule';
import { ChatService } from '../services/chat.service';
import { LocalStorageService } from '../services/local-storage.service';
import { RuleService } from '../services/rule.service';
import { TokenStorageService } from '../services/token-storage.service';

@Component({
  selector: 'app-delete-rule',
  templateUrl: './delete-rule.component.html',
  styleUrls: ['./delete-rule.component.scss']
})
export class DeleteRuleComponent implements OnInit {
  loading : boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {rule: Rule},
    private _snackBar: MatSnackBar,
    private chatbotService : ChatService,
    private ruleService:RuleService,
    private localStorageService:LocalStorageService,
    private tokenStorageService:TokenStorageService) {}

  deleteTask(){
    this.ruleService.deleteTask(this.data.rule.id).subscribe(
      (data:string)=>{
        this.loading =false;
        this.openSnackBar(data);
        this.localStorageService.removePinnedRule(this.data.rule.title,this.tokenStorageService.getUser().username)
        window.location.reload();
      },
      (error)=>{console.log(error);this.loading = false;}
    )
  }

  deleteChatbotTask(){
    this.loading = true;
    this.chatbotService.deleteChatbotRule(this.data.rule.title).subscribe(
      data=>this.deleteTask(),error=>{console.log(error);this.loading = false;}
    )
  }

  
  openSnackBar(message:string){
    let horizontalPosition: MatSnackBarHorizontalPosition = 'end';
    let verticalPosition: MatSnackBarVerticalPosition = 'top';
    this._snackBar.open(message, 'Fermer', {
      duration: 2000,
      horizontalPosition: horizontalPosition,
      verticalPosition: verticalPosition,
    });
  }
  ngOnInit(): void {

  }
  
}
