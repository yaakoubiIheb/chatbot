import { Component, OnInit } from '@angular/core';
import { User } from './classes/User';
import { TokenStorageService } from './services/token-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Chat';
  currentUser! : User;
  constructor(private _tokenStorageService:TokenStorageService){}
  
  public get tokenStorageService(){
    return this._tokenStorageService;
  }
  ngOnInit(){}
}
