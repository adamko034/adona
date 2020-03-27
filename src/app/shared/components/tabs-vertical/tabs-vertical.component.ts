import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Route } from 'src/app/core/router/model/route.model';
import { RouterFacade } from 'src/app/core/router/router.facade';

@Component({
  selector: 'app-tabs-vertical',
  templateUrl: './tabs-vertical.component.html',
  styleUrls: ['./tabs-vertical.component.scss']
})
export class TabsVerticalComponent implements OnInit {
  @Input() routes: Route[];

  public currentRoute$: Observable<string>;

  constructor(private routeFacade: RouterFacade) {}

  public ngOnInit(): void {
    this.currentRoute$ = this.routeFacade.selectCurrentRute();
  }
}
