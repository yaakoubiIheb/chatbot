import { AfterViewInit, Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Function } from '../classes/Function';
import { Permission } from '../classes/Permission';
import { User } from '../classes/User';
import { AuthService } from '../services/auth.service';
import { PermissionService } from '../services/permission.service';
import { TokenStorageService } from '../services/token-storage.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  tab1Selected = true;
  loginForm! : FormGroup;
  roles: string[] = [];
  loading : boolean = false;
  userToken : any;

  public scrolls(el: HTMLElement) {
    el.scrollIntoView();
  }
  constructor(private authService:AuthService,
    private tokenStorage : TokenStorageService,
    private formBuilder : FormBuilder,
    private router : Router,
    private _snackBar:MatSnackBar,
    private userService : UserService,
    private permissionService:PermissionService) { }

    onSubmit(): void {
      let username : string = this.loginForm.value['username'];
      let password : string = this.loginForm.value['password'];
      this.loading = true;
      this.authService.login(username, password).subscribe(
        (data : string) => {
          if(data == "Mot de passe incorrect" || data == "Cet Utilisateur n'existe pas"){
            this.openSnackBar(data);
            this.loading = false;
          }else{
            this.chatbotLogin();
            let obj = JSON.parse(data);
            this.userToken = obj;
            if(obj.userType == 'Administrateur'){
              this.tokenStorage.saveToken(obj.accessToken);
              this.tokenStorage.saveUser(obj);
              this.loading = false; 
              this.router.navigate(['taches']);
            }else{
              this.getEmployeeById(obj.id);
            }
          }
        },
        error => {
          console.log(error);
          this.loading = false;
        }
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

    chatbotLogin(){
      this.authService.chatbotLogin().subscribe(
        (data:any)=>{
          this.tokenStorage.saveChatbotToken(data.token)
        },error=>console.log(error)
      )
    }

    getEmployeeById(id:number){
      this.userService.getEmployeeById(id).subscribe(
        (data:User)=>this.getUserFunction(data.id)
      )
    }
    getPermission(permissionId){
      this.permissionService.getPermissionById(permissionId).subscribe(
        (data:Permission)=>{
          this.tokenStorage.savePermission(data);
          this.tokenStorage.saveUser(this.userToken);
          this.tokenStorage.saveToken(this.userToken.accessToken);
          this.loading = false; 
          this.router.navigate(['taches']);
        }
      )
    }

    getUserFunction(userId){
      this.userService.getEmployeeFunction(userId).subscribe(
        (data:Function)=>{
          this.getPermission(data.permissionId);
        }
      )
    }
  ngOnInit(): void {
    Promise.resolve().then(()=>this.tokenStorage.signOut());
    this.loginForm = this.formBuilder.group({
      username : [],
      password : []
    });
  }

}
