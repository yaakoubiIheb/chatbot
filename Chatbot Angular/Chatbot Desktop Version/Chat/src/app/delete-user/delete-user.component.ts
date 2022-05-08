import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { User } from '../classes/User';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.scss']
})
export class DeleteUserComponent implements OnInit {

  loading : boolean = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: {user: User},
  private userService:UserService,
  private _snackBar: MatSnackBar,
  private dialogRef: MatDialogRef<DeleteUserComponent>) { }

  deleteUser(user:User){
    this.loading = true;
    this.userService.deleteEmployee(user).subscribe(
      (data:string)=>{
        this.loading = false;
        this.dialogRef.close();
        this.openSnackBar(data);
        window.location.reload();
      },
      (error)=>{console.log(error);this.loading=false}
    );
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
