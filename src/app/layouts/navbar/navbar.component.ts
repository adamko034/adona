import { Component, OnInit } from '@angular/core';
import { AuthFacade } from '../../core/auth/auth.facade';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  constructor(private authFacade: AuthFacade) {}

  ngOnInit() {}

  public logout() {
    this.authFacade.logout();
  }
}
