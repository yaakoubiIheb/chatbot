import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Function } from '../classes/Function';
import { User } from '../classes/User';
import { DeleteUserComponent } from '../delete-user/delete-user.component';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { FunctionService } from '../services/function.service';
import { OtherFunctionsService } from '../services/other-functions.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  user!: User;
  function : Function;
  avatarColor : string = this.otherFunctionsService.getRandomColor("0.3");

  constructor(@Inject(MAT_DIALOG_DATA) public data: {username: string},
  private userService:UserService,
  private otherFunctionsService:OtherFunctionsService,
  private functionService:FunctionService,
  public dialog: MatDialog) { }

  getUser(username:string){
    this.userService.getEmployeeByUsername(username).subscribe(
      (data : User)=>{
        this.user = data;
        this.getUserFunction(this.user.id);
      },(error:any)=>{console.log(error)}
    )
  }
  openDeleteUserDialog(user:User){
    let deleteUserDialog = this.dialog.open(DeleteUserComponent,{data : {user:user}});
  }
  openUpdateUserDialog(username:string){
    let updateUserDialog = this.dialog.open(EditUserComponent,{data : {username:username}});
  }
  getUserFunction(id){
    this.userService.getEmployeeFunction(id).subscribe(
      (data:Function)=>this.function = data
    )
  }
  ngOnInit(): void {
    this.getUser(this.data.username);
  }

}
