import { Component, OnInit,AfterViewInit,ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import { AddUserComponent } from '../add-user/add-user.component';
import { User } from '../classes/User';
import { DeleteUserComponent } from '../delete-user/delete-user.component';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { UserService } from '../services/user.service';
import { UserDetailsComponent } from '../user-details/user-details.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<any>;
  panelOpenState = false;
  value = '';
  displayedColumns: string[] = [];
  dataSource! : MatTableDataSource<User>;
  users: User[] = [];
  tableLoaded: boolean = false;
  avatarColors : string[] = [];

  

  constructor(private userService:UserService,
    public dialog: MatDialog) { }
  getAllUsers(){
    this.userService.getAllEmployees().subscribe(
      (data:User[])=>{
        this.users = data;
        console.log(data);
        for(let u of this.users)this.avatarColors.push(this.getRandomColor());
        this.dataSource = new MatTableDataSource(this.users);
        this.displayedColumns.push("index");
        this.displayedColumns.push("name");
        this.displayedColumns.push("username");
        this.displayedColumns.push("address");
        this.displayedColumns.push("telephoneNum");
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log(this.dataSource);
        this.tableLoaded = true;
      },(error:any)=>{
        console.log(error);
      }
    )
  }
  renderTableRows(){
    this.userService.getAllEmployees().subscribe(
      (data:User[])=>{
        this.users = data;
        this.dataSource.data = this.users;
        this.table.renderRows();
      },(error:any)=>{console.log(error);})
  }
  openAddUserDialog(){
    let addUserDialog = this.dialog.open(AddUserComponent);
    addUserDialog.afterClosed().subscribe(result=>{
      this.renderTableRows();
    })
  }
  openUserDetailsDialog(username:string){
    this.userService.openUserDetailsDialog(username);
  }
  openDeleteUserDialog(user:User){
    let deleteUserDialog = this.dialog.open(DeleteUserComponent,{data : {user:user}});
    deleteUserDialog.afterClosed().subscribe(result=>{
      this.renderTableRows();
    })
  }
  openEditUserDialog(username:string){
    let editUserDialog = this.dialog.open(EditUserComponent,{data : {username:username}});
    editUserDialog.afterClosed().subscribe(result=>{
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

  getRandomColor() {
    let trans = '0.2';
    let color = 'rgba(';
    for (let i = 0; i < 3; i++) {
      color += Math.floor(Math.random() * 255) + ',';
    }
    color += trans + ')';
    return color;
  }

  ngAfterViewInit() {
    this.getAllUsers();
  }
}
