import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  constructor(private router: Router) {}

  public toLogin() {
    this.router.navigate(['/login']);
  }

  public toVerifyEmail() {
    this.router.navigate(['/login/verifyEmail']);
  }

  public toHome() {
    this.router.navigate(['/home']);
  }

  public toExpensesMobile(params: string = '') {
    this.router.navigate([`/expenses/m/${params}`]);
  }

  public toExpensesDesktop(params: string = '') {
    this.router.navigate([`/expenses/d/${params}`]);
  }

  public toExpenseContent(groupId: string) {
    this.router.navigate([`/expenses/d/${groupId}`]);
  }
}
