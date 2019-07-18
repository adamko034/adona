import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { Router } from '@angular/router';
import { NavigationService } from 'src/app/shared/services/navigation/navigation.service';
import { AppState } from '../../reducers';
import { Store, select } from '@ngrx/store';
import { Logout } from '../../modules/auth/store/actions/auth.actions';
import { Observable } from 'rxjs';
import { isLoggedIn } from '../../modules/auth/store/selectors/auth.selectors';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  isLoggedIn$: Observable<boolean>;

  constructor(private authService: AuthService,
    private navigationService: NavigationService,
    private store: Store<AppState>) { }

  ngOnInit() {
    this.isLoggedIn$ = this.store
      .pipe(
        select(isLoggedIn)
      );
  }

  public logout() {
    this.authService.logout()
      .then(() => {
        this.store.dispatch(new Logout());
        this.navigationService.toLogin();
      });
  }
}
