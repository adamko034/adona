import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { GuiFacade } from 'src/app/core/gui/gui.facade';
import { Logger } from 'src/app/shared/utils/logger/logger';

@Injectable({ providedIn: 'root' })
export class ClearToastrGuard implements CanActivate {
  constructor(private guiFacade: GuiFacade) {}

  public canActivate(): boolean {
    Logger.logDev('clear toastr guard, clearing');
    this.guiFacade.clearToastr();
    return true;
  }
}
