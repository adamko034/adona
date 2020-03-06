import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Observable } from 'rxjs';
import { SharedModule } from '../../shared.module';
import { DialogProperties } from './dialog-properties.model';

@Injectable({ providedIn: SharedModule })
export class DialogService {
  constructor(private matDialog: MatDialog, private deviceService: DeviceDetectorService) {}

  public open<T>(component: ComponentType<any>, properties?: DialogProperties<T>): Observable<any> {
    if (!properties) {
      properties = {};
    }

    if (!properties.width) {
      properties.width = this.getDialogWidth();
      properties.maxWidth = this.getMaxWidth();
    }

    if (properties.data === undefined) {
      properties.data = null;
    }

    if (properties.autoFocus === undefined) {
      properties.autoFocus = false;
    }

    properties.panelClass = 'adona-dialog';

    const dialogRef = this.matDialog.open(component, properties);
    return dialogRef.afterClosed();
  }

  private getDialogWidth(): string {
    return this.deviceService.isMobile() ? '90vw' : '400px';
  }

  private getMaxWidth(): string {
    return this.deviceService.isMobile() ? '90vw' : '80vw';
  }
}
