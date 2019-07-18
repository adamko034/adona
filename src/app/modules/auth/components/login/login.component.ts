import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { Store } from '@ngrx/store';
import { NavigationService } from '../../../../shared/services/navigation/navigation.service';
import { Login } from '../../store/actions/auth.actions';
import { User } from '../../../../shared/models/auth/user-model';
import { AppState } from '../../../../reducers';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public credentials = {
    email: '', password: ''
  };

  constructor(private authService: AuthService,
    private navigationService: NavigationService,
    private store: Store<AppState>) { }

  ngOnInit() { }

  public login() {
    this.authService
      .login(this.credentials)
      .then((res) => {
        const { uid, displayName, email, phoneNumber, photoURL } = res.user;
        const user: User = { id: uid, displayName, email, phoneNumber, photoUrl: photoURL };

        this.store.dispatch(new Login({ user }))
        this.navigationService.toHome();
      });
  }
}
