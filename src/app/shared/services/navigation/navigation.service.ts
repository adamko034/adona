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

  public toCalendarMonthView() {
    this.router.navigate(['/calendar/month']);
  }

  public toCalendarWeekView() {
    this.router.navigate(['/calendar/week']);
  }

  public toCalendarDayView() {
    this.router.navigate(['/calendar/day']);
  }

  public toCalendarListView() {
    this.router.navigate(['/calendar/list']);
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

  public toResetPassword(oobCode: string) {
    this.router.navigate(['/login/changePassword'], { queryParams: { oobCode } });
  }

  public toEmailVerified(oobCode: string) {
    this.router.navigate(['/login/emailVerified'], { queryParams: { oobCode } });
  }
}
