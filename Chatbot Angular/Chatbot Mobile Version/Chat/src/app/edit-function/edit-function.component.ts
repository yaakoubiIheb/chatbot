import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Function } from '../classes/Function';
import { Permission } from '../classes/Permission';
import { FunctionService } from '../services/function.service';
import { PermissionService } from '../services/permission.service';
import { Router } from '@angular/router';
import { OtherFunctionsService } from '../services/other-functions.service';

@Component({
  selector: 'app-edit-function',
  templateUrl: './edit-function.component.html',
  styleUrls: ['./edit-function.component.scss']
})
export class EditFunctionComponent implements OnInit {

  editFunctionForm!: FormGroup;
  permissions : Permission[] = [];
  loading : boolean = false;

  constructor(private functionService:FunctionService,
    private permissionService : PermissionService,
    private formBuilder:FormBuilder,
    private _snackBar: MatSnackBar,
    private router:Router,
    private otherFunctionsService:OtherFunctionsService,
    @Inject(MAT_DIALOG_DATA) public data: {function: Function}) {}

  getAllPermissions(){
    this.permissionService.getAllPermissions().subscribe(
      (data:Permission[])=>{
        this.permissions = data;
      },(error:any)=>console.log(error)
    )
  }

  editFunction(funct : Function){
    this.loading = true;
    this.functionService.editFunction(funct).subscribe(
      (data:string)=>{
        this.loading = false;
        this.openSnackBar(data);
        this.otherFunctionsService.reRenderComponent(this.router);
      },(error:any)=>{this.loading = false;this.openSnackBar("Erreur");console.log(error)}
    )
  }
  

  onSubmit(){
    let funct = new Function(
      this.data.function.id,
      this.editFunctionForm.value['title'],
      this.editFunctionForm.value['description'] ?? "",
      this.editFunctionForm.value['permission'],
    );
    this.editFunction(funct);
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
    this.getAllPermissions();
    this.editFunctionForm = this.formBuilder.group({
      title : [this.data.function.title],
      description:[this.data.function.description],
      permission : [this.data.function.permissionId]
    });
  }

}
