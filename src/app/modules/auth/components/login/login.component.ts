import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store/reducers';
import { LoginAction } from '../../store/actions/auth.actions';

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

  constructor(private store: Store<AppState>) {}

  ngOnInit() {}

  public login() {
    this.store.dispatch(new LoginAction(this.credentials));
  }
}
