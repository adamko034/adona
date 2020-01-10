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

  public toHome() {
    this.router.navigate(['/home/calendar']);
  }

  public toExpensesMobile(params: string = '') {
    this.router.navigate([`/home/expenses/m/${params}`]);
  }

  public toExpensesDesktop(params: string = '') {
    this.router.navigate([`/home/expenses/d/${params}`]);
  }

  public toExpenseContent(groupId: string) {
    this.router.navigate([`/home/expenses/d/${groupId}`]);
  }
}
