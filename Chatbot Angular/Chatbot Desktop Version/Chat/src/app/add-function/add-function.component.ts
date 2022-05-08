import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Function } from '../classes/Function';
import { Permission } from '../classes/Permission';
import { FunctionService } from '../services/function.service';
import { PermissionService } from '../services/permission.service';

@Component({
  selector: 'app-add-function',
  templateUrl: './add-function.component.html',
  styleUrls: ['./add-function.component.scss']
})
export class AddFunctionComponent implements OnInit {
  
  addFunctionForm!: FormGroup;
  permissions : Permission[] = [];
  loading : boolean = false;

  constructor(private functionService:FunctionService,
    private permissionService : PermissionService,
    private formBuilder:FormBuilder,
    private _snackBar: MatSnackBar) {}

  getAllPermissions(){
    this.permissionService.getAllPermissions().subscribe(
      (data:Permission[])=>{
        this.permissions = data;
      },(error:any)=>console.log(error)
    )
  }

  addFunction(funct : Function){
    this.loading = true;
    this.functionService.addFunction(funct).subscribe(
      (data:string)=>{
        this.loading = false;
        this.openSnackBar(data);
        window.location.reload();
      },(error:any)=>{this.loading = false;this.openSnackBar("Erreur");console.log(error)}
    )
  }
  

  onSubmit(){
    let funct = new Function(
      0,
      this.addFunctionForm.value['title'],
      this.addFunctionForm.value['description'] ?? "",
      this.addFunctionForm.value['permission'],
    );
    this.addFunction(funct);
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
    this.addFunctionForm = this.formBuilder.group({
      title : [],
      description:[],
      permission : []
    });
  }

}
