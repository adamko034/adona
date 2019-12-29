import { Component, OnDestroy, OnInit } from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Observable, Subscription } from 'rxjs';
import { AdonaCalendarView } from 'src/app/modules/calendar/model/adona-calendar-view.model';
import { TimeService } from 'src/app/shared/services/time/time.service';
import { DialogAction } from '../../../../shared/enum/dialog-action.enum';
import { DialogResult } from '../../../../shared/models/dialog-result.model';
import { NewEventDialogComponent } from '../../components/dialogs/new-event-dialog/new-event-dialog.component';
import { CalendarEventDialogService } from '../../service/calendar-event-dialog.service';
import { CalendarFacade } from '../../store/calendar.facade';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, OnDestroy {
  private dialogResultSubscription: Subscription;

  public view: AdonaCalendarView = { isList: false, view: CalendarView.Month };
  public viewDate = new Date();
  public events$: Observable<CalendarEvent[]>;

  constructor(
    private facade: CalendarFacade,
    private timeService: TimeService,
    private deviceService: DeviceDetectorService,
    private dialogService: CalendarEventDialogService
  ) {}

  public ngOnInit() {
    this.view.isList = this.deviceService.isMobile();

    this.events$ = this.facade.events$;
    this.facade.loadMonthEvents(this.viewDate);
    this.facade.loadMonthEvents(this.timeService.Extraction.getPreviousMonthOf(this.viewDate));
    this.facade.loadMonthEvents(this.timeService.Extraction.getNextMonthOf(this.viewDate));
  }

  public ngOnDestroy() {
    if (this.dialogResultSubscription) {
      this.dialogResultSubscription.unsubscribe();
    }
  }

  public onViewChanged(adonaCalendarView: AdonaCalendarView) {
    this.view = adonaCalendarView;
  }

  public onViewDateChanged(newViewDate: Date) {
    const fetchDate = this.adjustFetchDate(newViewDate);
    this.viewDate = newViewDate;

    this.facade.loadMonthEvents(fetchDate);
  }

  public onEventClicked(event?: CalendarEvent) {
    const props = { width: '400px', data: { event } };
    this.dialogResultSubscription = this.dialogService
      .open(NewEventDialogComponent, props)
      .subscribe((result: DialogResult) => {
        if (result && result.payload) {
          switch (result.action) {
            case DialogAction.SaveAdd:
              this.facade.addEvent(result.payload);
              break;
            case DialogAction.SaveUpdate:
              this.facade.updateEvent(result.payload);
              break;
            case DialogAction.Delete:
              this.facade.deleteEvent(result.payload);
              break;
            default:
              break;
          }
        }
      });
  }

  private adjustFetchDate(newViewDate: Date): Date {
    if (this.view.view === CalendarView.Week) {
      const startOfWeek = this.timeService.Extraction.getStartOfWeek(newViewDate);
      const endOfWeek = this.timeService.Extraction.getEndOfWeek(newViewDate);

      if (!this.timeService.Comparison.areDatesInTheSameMonth(this.viewDate, startOfWeek)) {
        return startOfWeek;
      }
      if (!this.timeService.Comparison.areDatesInTheSameMonth(this.viewDate, endOfWeek)) {
        return endOfWeek;
      }
    }

    return newViewDate;
  }
}
