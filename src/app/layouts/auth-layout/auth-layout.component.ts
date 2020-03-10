import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RouterFacade } from 'src/app/core/router/router.facade';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss']
})
export class AuthLayoutComponent implements OnInit, OnDestroy {
  private currentRouteSubscription: Subscription;

  public title: string;

  constructor(private routerFacade: RouterFacade) {}

  public ngOnInit() {
    this.currentRouteSubscription = this.routerFacade.selectCurrentRute().subscribe((route: string) => {
      this.title = route.includes('register') ? 'Register' : 'Login';
    });
  }

  public ngOnDestroy() {
    if (this.currentRouteSubscription) {
      this.currentRouteSubscription.unsubscribe();
    }
  }
}
