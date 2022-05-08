import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class OtherFunctionsService {

  constructor(private _snackBar: MatSnackBar) { }

  getRandomColor(opacity:string){
    let color = 'rgba(';
    for (let i = 0; i < 3; i++) {
      color += Math.floor(Math.random() * 255) + ',';
    }
    color += opacity + ')';
    return color;
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

  reRenderComponent(router:Router){
    let currentUrl = router.url;
    router.routeReuseStrategy.shouldReuseRoute = () => false;
    router.onSameUrlNavigation = 'reload';
    router.navigate([currentUrl]);
  }
}
