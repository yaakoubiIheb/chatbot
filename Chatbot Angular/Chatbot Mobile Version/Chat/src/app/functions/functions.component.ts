import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { AddFunctionComponent } from '../add-function/add-function.component';
import { Function } from '../classes/Function';
import { Permission } from '../classes/Permission';
import { FunctionDetailsComponent } from '../function-details/function-details.component';
import { FunctionService } from '../services/function.service';
import { PermissionService } from '../services/permission.service';

@Component({
  selector: 'app-functions',
  templateUrl: './functions.component.html',
  styleUrls: ['./functions.component.scss']
})
export class FunctionsComponent implements OnInit {

  panelOpenState = false;
  value = '';
  displayedColumns: string[] = [];
  dataSource! : MatTableDataSource<Function>;
  functions : Function[] = [];
  permissions : Permission[] = [];
  tableLoaded: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<any>;

  constructor(private functionService:FunctionService,
    public dialog: MatDialog,
    public permissionService:PermissionService) { }
  getAllFunctions(){
    this.functionService.getAllFunctions().subscribe(
      (data:Function[])=>{
        this.functions = data;
        this.dataSource = new MatTableDataSource(this.functions);
        this.displayedColumns.push("title");
        this.displayedColumns.push("permissionId");
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.tableLoaded = true;
      },(error:any)=>{
        console.log(error);
      }
    )
  }
  renderTableRows(){
    this.functionService.getAllFunctions().subscribe(
      (data:Function[])=>{
        this.functions = data;
        this.dataSource.data = this.functions;
        this.table.renderRows();
      },(error:any)=>{console.log(error);})
  }
  getAllPermissions(){
    this.permissionService.getAllPermissions().subscribe(
      (data:Permission[])=>{
        this.permissions = data;
      },error=>console.log(error)
    )
  }
  getPermission(id:number){
    for(let p of this.permissions){
      if(p.id == id ) return p.title;
    }
    return 0;
  }
  openAddFunctionDialog(){
    let addFunctionDialog = this.dialog.open(AddFunctionComponent);
    addFunctionDialog.afterClosed().subscribe(result=>{
      this.renderTableRows();
    })
  }
  openFunctionDetailsDialog(funct:Function){
    let functionDetailsDialog = this.dialog.open(FunctionDetailsComponent,{data : {function:funct}});
    functionDetailsDialog.afterClosed().subscribe(result=>{
      this.renderTableRows();
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnInit(): void {
    this.getAllPermissions();
    this.getAllFunctions();
  }

}
