import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CalendarModule } from 'angular-calendar';
import { Observable } from 'rxjs';
import { DialogProperties } from '../model/calendar-dialog-properties.model';

@Injectable({ providedIn: CalendarModule })
export class CalendarEventDialogService {
  constructor(private matDialog: MatDialog) {}

  public open(component: ComponentType<any>, properties: DialogProperties): Observable<any> {
    const dialogRef = this.matDialog.open(component, properties);

    return dialogRef.afterClosed();
  }
}
