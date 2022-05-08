import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { User } from '../classes/User';
import { Function } from '../classes/Function';
import { FunctionService } from '../services/function.service';
import { UserService } from '../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OtherFunctionsService } from '../services/other-functions.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  username:string;
  user! : User;
  editUserForm!: FormGroup;
  usernameExist : boolean = false;
  functions : Function[] = [];
  loading :boolean = false;


  constructor(private activatedroute: ActivatedRoute,
  private userService:UserService,
  private formBuilder:FormBuilder,
  private functionService:FunctionService,
  private _snackBar: MatSnackBar,
  private router:Router) { 
    
  }

  getUser(username:string){
    this.userService.getEmployeeByUsername(username).subscribe(
      (data:User)=>{
        this.user = data;
        this.editUserForm = this.formBuilder.group({
          username : [this.user.username],
          name:[this.user.name],
          lastname : [this.user.lastname],
          address : [this.user.address],
          telephoneNum : [Number.parseInt(this.user.telephoneNum)],
          email : [this.user.email],
          function : [this.user.functionId],
          password : [this.user.password],
          passwordRepeat : [this.user.password]
        },{validators: [this.ConfirmedValidator("password", "passwordRepeat"),this.confirmUsername("username")]});
      },(error)=>console.log(error)
    )
  }
  getAllFunctions(){
    this.functionService.getAllFunctions().subscribe(
      (data:any)=>{
        this.functions = data ?? [];
      },(error:any)=>console.log(error)
    )
  }

  onSubmit(){
    let user = new User(
      this.user.id,
      this.editUserForm.value['username'],
      this.editUserForm.value['name'] ?? "",
      this.editUserForm.value['lastname'] ?? "",
      this.editUserForm.value['address'] ?? "",
      this.editUserForm.value['telephoneNum'] ?? "",
      this.editUserForm.value['password'],
      this.editUserForm.value['email'] ?? "",
      "Employe",
      this.editUserForm.value['function']
    );
    this.editUser(user);
  }
  editUser(user:User){
    this.loading = true;
    this.userService.updateEmployee(user).subscribe(
      (data:string)=>{
        this.loading = false;
        this.openSnackBar(data);
        this.router.navigate(['utilisateurs']);
      },(error:any)=>{this.openSnackBar("Erreur");this.loading = false;}
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

  ConfirmedValidator(controlName: string, matchingControlName: string){
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];
        if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
            return;
        }
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ confirmedValidator: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
}
userExist(username:string,userControl){
  this.userService.userExist(username).subscribe(
    (data:boolean)=>{
      if(this.user.username == username){
        this.usernameExist = false;
      }else{
        this.usernameExist = data;
      }
      if (userControl.errors && !userControl.errors.confirmedValidator) {
        return;
      }
      if (this.usernameExist) {
        userControl.setErrors({ confirmedValidator: true });
      } else {
        userControl.setErrors(null);
      }
    }, error => console.log(error)
  )
}
confirmUsername(username: string) {
  return (formGroup: FormGroup) => {
    let userControl = formGroup.controls[username];
    this.userExist(userControl.value, userControl);
  }
}
  ngOnInit(): void {
    this.username = this.activatedroute.snapshot.paramMap.get("username");
    this.getUser(this.username);
    this.getAllFunctions();
    this.editUserForm = this.formBuilder.group({
      username : [],
      name:[],
      lastname : [],
      address : [],
      telephoneNum : [],
      email : [],
      function : [],
      password : [],
      passwordRepeat : []
    },{validators: [this.ConfirmedValidator("password", "passwordRepeat"),this.confirmUsername("username")]});
  }

}
