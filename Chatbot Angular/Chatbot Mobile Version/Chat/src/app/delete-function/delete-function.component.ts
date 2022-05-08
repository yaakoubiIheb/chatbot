import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Function } from '../classes/Function';
import { FunctionService } from '../services/function.service';
import { OtherFunctionsService } from '../services/other-functions.service';

@Component({
  selector: 'app-delete-function',
  templateUrl: './delete-function.component.html',
  styleUrls: ['./delete-function.component.scss']
})
export class DeleteFunctionComponent implements OnInit {
  loading : boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {function: Function},
    private _snackBar: MatSnackBar,
    private functionService:FunctionService,
    private router:Router,
    private otherFunctionsService:OtherFunctionsService) { }

  deleteFunction(funct:Function){
    this.loading = true;
    this.functionService.deleteFunction(funct).subscribe(
      (data:string)=>{
        this.loading = false;
        this.openSnackBar(data);
        this.otherFunctionsService.reRenderComponent(this.router);
      },
      (error)=>{console.log(error);this.loading = false}
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
  ngOnInit(): void {}

}
