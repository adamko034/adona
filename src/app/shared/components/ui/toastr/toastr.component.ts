import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GuiFacade } from 'src/app/core/gui/gui.facade';
import { ToastrData } from 'src/app/shared/components/ui/toastr/models/toastr-data/toastr-data.mode';
import { ToastrMode } from 'src/app/shared/components/ui/toastr/models/toastr-mode/toastr-mode.enum';
import { UnsubscriberService } from 'src/app/shared/services/infrastructure/unsubscriber/unsubscriber.service';

@Component({
  selector: 'app-toastr',
  template: ''
})
export class ToastrComponent implements OnInit, OnDestroy {
  private destroyed$: Subject<void>;

  constructor(
    private guiFacade: GuiFacade,
    private unsubscriberService: UnsubscriberService,
    private toastrService: ToastrService
  ) {
    this.destroyed$ = this.unsubscriberService.create();
  }

  public ngOnInit(): void {
    this.guiFacade
      .selectToastrData()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((taostrData: ToastrData) => this.showToastr(taostrData));
  }

  public ngOnDestroy(): void {
    this.unsubscriberService.complete(this.destroyed$);
  }

  private showToastr(data: ToastrData): void {
    if (data) {
      const { mode, message, title } = data;
      switch (mode) {
        case ToastrMode.ERROR:
          this.toastrService.error(message, title);
          break;
        case ToastrMode.WARNING:
          this.toastrService.warning(message, title);
          break;
        case ToastrMode.SUCCESS:
          this.toastrService.success(message, title);
          break;
        default:
          this.toastrService.info(message, title);
      }
    }
  }
}
