import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Function } from '../classes/Function';
import { Permission } from '../classes/Permission';
import { DeleteFunctionComponent } from '../delete-function/delete-function.component';
import { EditFunctionComponent } from '../edit-function/edit-function.component';
import { PermissionService } from '../services/permission.service';

@Component({
  selector: 'app-function-details',
  templateUrl: './function-details.component.html',
  styleUrls: ['./function-details.component.scss']
})
export class FunctionDetailsComponent implements OnInit {
  permissions : Permission[] = [];
  constructor(@Inject(MAT_DIALOG_DATA) public data: {function: Function},
  private permissionService : PermissionService,
  private dialog: MatDialog,
  private router:Router) { }

  getAllPermissions(){
    this.permissionService.getAllPermissions().subscribe(
      (data:Permission[])=>{
        this.permissions = data;
      },(error:any)=>console.log(error)
    )
  }

  getPermission(id:number){
    for(let p of this.permissions){
      if(p.id == id ) return p.title;
    }
    return 0;
  }

  openUpdateFunctionDialog(funct:Function){
    let editFunctionDialog = this.dialog.open(EditFunctionComponent, {data: { function: funct }});
  }
  openDeleteFunctionDialog(funct:Function){
    let deleteFunctionDialog = this.dialog.open(DeleteFunctionComponent,{data : {function: funct}});
  }
  ngOnInit(): void {
    this.getAllPermissions();
  }

}
