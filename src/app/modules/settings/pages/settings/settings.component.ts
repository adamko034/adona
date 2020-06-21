import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RouterFacade } from 'src/app/core/router/router.facade';
import { SettingsPages } from 'src/app/modules/settings/enums/settings-types.enum';
import { SettingsToolbar } from 'src/app/modules/settings/models/settings-toolbar/settings-toolbar.model';
import { UnsubscriberService } from 'src/app/shared/services/infrastructure/unsubscriber/unsubscriber.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {
  private destroyed$: Subject<void>;
  public data: SettingsToolbar;

  constructor(private routerFacade: RouterFacade, private unsubscriber: UnsubscriberService) {
    this.destroyed$ = this.unsubscriber.create();
  }

  public ngOnInit(): void {
    this.routerFacade
      .selectRouteData<{ settingsPage: SettingsPages; toolbar: SettingsToolbar }>()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(({ toolbar }) => (this.data = toolbar));
  }

  public ngOnDestroy(): void {
    this.unsubscriber.complete(this.destroyed$);
  }
}
