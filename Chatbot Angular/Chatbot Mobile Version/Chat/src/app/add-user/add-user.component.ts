import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, ValidatorFn, ValidationErrors } from '@angular/forms';
import { Function } from '../classes/Function';
import { User } from '../classes/User';
import { FunctionService } from '../services/function.service';
import { UserService } from '../services/user.service';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { OtherFunctionsService } from '../services/other-functions.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  functions: Function[] = [];
  addUserForm!: FormGroup;
  usernameExist : boolean = false;
  loading :boolean = false;

  constructor(private functionService: FunctionService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private _snackBar: MatSnackBar,
    private router:Router,
    private otherFunctionsService:OtherFunctionsService) {}

  getAllFunctions() {
    this.functionService.getAllFunctions().subscribe(
      (data: any) => {
        this.functions = data ?? [];
      }, (error: any) => console.log(error)
    )
  }

  addUser(user: User) {
    this.loading = true;
    this.userService.addEmployee(user).subscribe(
      (data: string) => {
        this.openSnackBar(data);
        this.loading = false;
        this.otherFunctionsService.reRenderComponent(this.router);
      }, (error: any) => {this.openSnackBar("Erreur");this.loading=false}
    )
  }


  onSubmit() {
    let user = new User(
      -1,
      this.addUserForm.value['username'],
      this.addUserForm.value['name'] ?? "",
      this.addUserForm.value['lastname'] ?? "",
      this.addUserForm.value['address'] ?? "",
      this.addUserForm.value['telephoneNum'] ?? "",
      this.addUserForm.value['password'],
      this.addUserForm.value['email'] ?? "",
      "Employe",
      this.addUserForm.value['function']);
    console.log(user);
    this.addUser(user);
  }

  convertNullToString(object: any) {
    if (object == null) return "";
    else return object;
  }

  openSnackBar(message: string) {
    let horizontalPosition: MatSnackBarHorizontalPosition = 'end';
    let verticalPosition: MatSnackBarVerticalPosition = 'top';
    this._snackBar.open(message, 'Fermer', {
      duration: 2000,
      horizontalPosition: horizontalPosition,
      verticalPosition: verticalPosition,
    });
  }

  ConfirmedValidator(controlName: string, matchingControlName: string) {
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
        this.usernameExist = data
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
    this.getAllFunctions();
    this.addUserForm = this.formBuilder.group({
      username: [""],
      name: [""],
      lastname: [""],
      address: [""],
      telephoneNum: [""],
      email: [""],
      function: [""],
      password: [""],
      passwordRepeat: [""]
    }, { validators: [this.ConfirmedValidator("password", "passwordRepeat"),this.confirmUsername("username")]});
  }

}
