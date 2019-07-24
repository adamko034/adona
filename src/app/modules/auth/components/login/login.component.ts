import { Component, OnInit } from '@angular/core';
import { AuthFacade } from '../../auth.facade';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public credentials = {
    email: '',
    password: ''
  };

  constructor(private authFacade: AuthFacade) {}

  ngOnInit() {}

  public login() {
    this.authFacade.login(this.credentials);
  }
}
