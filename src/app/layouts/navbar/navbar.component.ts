import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { NavigationService } from 'src/app/shared/services/navigation/navigation.service';
import { LogoutAction } from '../../modules/auth/store/actions/auth.actions';
import { isLoggedIn } from '../../modules/auth/store/selectors/auth.selectors';
import { AppState } from '../../store/reducers';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;

  constructor(
    private store: Store<AppState>
  ) { }

  ngOnInit() {
  }

  public logout() {
    this.store.dispatch(new LogoutAction());
  }
}
