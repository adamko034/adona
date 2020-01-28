import { Component, OnDestroy, OnInit } from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Observable, Subscription } from 'rxjs';
import { UserFacade } from 'src/app/core/user/user.facade';
import { AdonaCalendarView } from 'src/app/modules/calendar/model/adona-calendar-view.model';
import { TimeService } from 'src/app/shared/services/time/time.service';
import { User } from '../../../../core/user/model/user-model';
import { DialogAction } from '../../../../shared/enum/dialog-action.enum';
import { DialogProperties } from '../../../../shared/services/dialogs/dialog-properties.model';
import { DialogResult } from '../../../../shared/services/dialogs/dialog-result.model';
import { DialogService } from '../../../../shared/services/dialogs/dialog.service';
import { NewEventDialogComponent } from '../../components/dialogs/new-event-dialog/new-event-dialog.component';
import { Event } from '../../model/event.model';
import { CalendarFacade } from '../../store/calendar.facade';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, OnDestroy {
  private dialogResultSubscription: Subscription;
  private viewSubscription: Subscription;
  private viewDateSubsciption: Subscription;

  public view: AdonaCalendarView = { isList: false, calendarView: CalendarView.Month };
  public viewDate = new Date();
  public events$: Observable<CalendarEvent[]>;
  public user$: Observable<User>;

  constructor(
    private facade: CalendarFacade,
    private timeService: TimeService,
    private deviceService: DeviceDetectorService,
    private dialogService: DialogService,
    private userFacade: UserFacade
  ) {}

  public ngOnInit() {
    this.viewSubscription = this.facade.getView().subscribe((view: AdonaCalendarView) => (this.view = view));
    this.viewDateSubsciption = this.facade.getViewDate().subscribe((viewDate: Date) => (this.viewDate = viewDate));
    this.events$ = this.facade.events$;

    this.userFacade.getUser().subscribe(user => {
      if (user) {
        this.facade.changeView({ isList: this.deviceService.isMobile(), calendarView: this.view.calendarView });
        this.facade.loadMonthEvents(this.viewDate);
        this.facade.loadMonthEvents(this.timeService.Extraction.getPreviousMonthOf(this.viewDate));
        this.facade.loadMonthEvents(this.timeService.Extraction.getNextMonthOf(this.viewDate));
      }
    });
  }

  public ngOnDestroy() {
    if (this.dialogResultSubscription) {
      this.dialogResultSubscription.unsubscribe();
    }

    if (this.viewSubscription) {
      this.viewSubscription.unsubscribe();
    }

    if (this.viewDateSubsciption) {
      this.viewDateSubsciption.unsubscribe();
    }
  }

  public onEventClicked(event?: CalendarEvent) {
    const props: DialogProperties<CalendarEvent> = { data: event };
    this.dialogResultSubscription = this.dialogService
      .open<CalendarEvent>(NewEventDialogComponent, props)
      .subscribe((result: DialogResult<Event>) => {
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
}
