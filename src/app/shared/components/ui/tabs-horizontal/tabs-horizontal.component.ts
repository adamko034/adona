import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Route } from 'src/app/core/router/model/route.model';
import { RouterFacade } from 'src/app/core/router/router.facade';

@Component({
  selector: 'app-tabs-horizontal',
  templateUrl: './tabs-horizontal.component.html',
  styleUrls: ['./tabs-horizontal.component.scss']
})
export class TabsHorizontalComponent implements OnInit {
  @Input() routes: Route[];

  public route$: Observable<string>;

  constructor(private routerFacade: RouterFacade) {}

  public ngOnInit(): void {
    this.route$ = this.routerFacade.selectCurrentRute();
  }

  public getRouteDescription(routeUrl: string) {
    return this.routes.find((route) => route.url === routeUrl)?.description;
  }
}
