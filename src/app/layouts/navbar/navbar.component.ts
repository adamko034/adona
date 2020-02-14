import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthFacade } from '../../core/auth/auth.facade';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Output() toogleSidenav = new EventEmitter<void>();

  constructor(private authFacade: AuthFacade) {}

  ngOnInit() {}

  public logout() {
    this.authFacade.logout();
  }

  public emitToogleSidenav() {
    this.toogleSidenav.emit();
  }
}
