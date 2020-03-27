import { Component, OnInit } from '@angular/core';
import { Route } from 'src/app/core/router/model/route.model';
import { RouterFacade } from 'src/app/core/router/router.facade';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  public routes: Route[] = [];

  constructor(private routerFacade: RouterFacade) {}

  public ngOnInit(): void {
    this.routes = this.routerFacade.selectSettingsRoutes();
  }
}
