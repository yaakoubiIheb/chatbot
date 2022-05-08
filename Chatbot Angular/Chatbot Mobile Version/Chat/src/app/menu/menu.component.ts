import { Component, OnInit } from '@angular/core';
import { Permission } from '../classes/Permission';
import { User } from '../classes/User';
import { TokenStorageService } from '../services/token-storage.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  user: User;
  permission : Permission;
  avatarColor: string;
  menuLeftPosition : string =  '-100vw';
  menuTogglePosition : string = '30vw';
  constructor(private tokenStorageService: TokenStorageService) { }

  getRandomColor() {
    let trans = '0.2';
    let color = 'rgba(';
    for (let i = 0; i < 3; i++) {
      color += Math.floor(Math.random() * 255) + ',';
    }
    color += trans + ')';
    return color;
  }
  signOut() {
    this.tokenStorageService.signOut();
  }
  toggleMenu(){
    if(this.menuLeftPosition == '0'){
      this.menuLeftPosition = '-100vw'
    }else{
      this.menuLeftPosition = '0'
    }
    if(this.menuTogglePosition == '0'){
      this.menuTogglePosition = '30vw'
    }else{
      this.menuTogglePosition = '0';
    }
  }
  ngOnInit(): void {
    this.user = this.tokenStorageService.getUser();
    this.permission = this.tokenStorageService.getPermission() ?? new Permission(-1,"","");
    this.avatarColor = this.getRandomColor();
  }

}
