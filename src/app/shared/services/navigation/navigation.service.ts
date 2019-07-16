import { Injectable } from '@angular/core';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  constructor(private router: Router) { }

  public toLogin() {
    this.router.navigate(['/login']);
  }

  public toHome() {
    this.router.navigate(['/home']);
  }
}
