import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public credentials = {
    email: '', password: ''
  };

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() { }

  public login() {
    this.authService
      .login(this.credentials)
      .then(() => this.router.navigate(['/home/calendar']));
  }
}
