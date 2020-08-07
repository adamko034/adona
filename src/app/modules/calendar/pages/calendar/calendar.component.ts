import { Component, OnDestroy, OnInit } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RouterFacade } from 'src/app/core/router/router.facade';
import { User } from 'src/app/core/user/model/user/user.model';
import { UserFacade } from 'src/app/core/user/user.facade';
import { NewEventDialogData } from 'src/app/modules/calendar/components/dialogs/new-event-dialog/models/new-event-dialog-data.model';
import { NewEventDialogComponent } from 'src/app/modules/calendar/components/dialogs/new-event-dialog/new-event-dialog.component';
import { AdonaCalendarViewBuilder } from 'src/app/modules/calendar/model/adona-calendar-view/adona-calendar-view.builder';
import { AdonaCalendarView } from 'src/app/modules/calendar/model/adona-calendar-view/adona-calendar-view.model';
import { Event } from 'src/app/modules/calendar/model/event.model';
import { CalendarFacade } from 'src/app/modules/calendar/store/calendar.facade';
import { DialogAction } from 'src/app/shared/enum/dialog-action.enum';
import { DialogProperties } from 'src/app/shared/services/dialogs/dialog-properties.model';
import { DialogResult } from 'src/app/shared/services/dialogs/dialog-result.model';
import { DialogService } from 'src/app/shared/services/dialogs/dialog.service';
import { UnsubscriberService } from 'src/app/shared/services/infrastructure/unsubscriber/unsubscriber.service';
import { TimeService } from 'src/app/shared/services/time/time.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, OnDestroy {
  private destroyed$: Subject<void>;

  public view: AdonaCalendarView;
  public viewDate = new Date();
  public events$: Observable<CalendarEvent[]>;
  public user: User;

  constructor(
    private facade: CalendarFacade,
    private timeService: TimeService,
    private dialogService: DialogService,
    private userFacade: UserFacade,
    private unsubscriberService: UnsubscriberService,
    private routerFacade: RouterFacade
  ) {
    this.destroyed$ = this.unsubscriberService.create();
  }

  public ngOnInit() {
    this.routerFacade
      .selectCurrentRoute()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((route: string) => {
        const view = AdonaCalendarViewBuilder.fromRoute(route).build();
        this.facade.changeView(view);
      });

    this.facade
      .selectView()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((view: AdonaCalendarView) => {
        this.view = view;
      });

    this.facade
      .selectViewDate()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((viewDate: Date) => (this.viewDate = viewDate));

    this.userFacade
      .selectUser()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((user: User) => {
        if (user) {
          this.user = user;
          const teamId = this.user.selectedTeamId;
          this.facade.loadMonthEvents(this.viewDate, teamId);
          this.facade.loadMonthEvents(this.timeService.Extraction.getPreviousMonthOf(this.viewDate), teamId);
          this.facade.loadMonthEvents(this.timeService.Extraction.getNextMonthOf(this.viewDate), teamId);
          this.events$ = this.facade.selectEvents(teamId);
        }
      });
  }

  public ngOnDestroy() {
    this.unsubscriberService.complete(this.destroyed$);
  }

  public onEventClicked(event?: CalendarEvent) {
    const data: NewEventDialogData = !!event
      ? {
          allDay: event.allDay,
          end: event.end,
          id: event.id,
          start: event.start,
          title: event.title
        }
      : null;
    const props: DialogProperties<NewEventDialogData> = { data };

    this.dialogService
      .open<NewEventDialogData>(NewEventDialogComponent, props)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((result: DialogResult<NewEventDialogData>) => {
        if (result && result.payload) {
          const { id, allDay, start, end, title } = result.payload;
          const eventToProcess: Event = {
            id: id.toString(),
            allDay,
            start,
            end,
            title,
            createdBy: this.user.name,
            createdById: this.user.id,
            created: new Date(),
            teamId: this.user.selectedTeamId
          };

          switch (result.action) {
            case DialogAction.SaveAdd:
              this.facade.addEvent(eventToProcess);
              break;
            case DialogAction.SaveUpdate:
              this.facade.updateEvent(eventToProcess);
              break;
            case DialogAction.Delete:
              this.facade.deleteEvent(eventToProcess);
              break;
            default:
              break;
          }
        }
      });
  }
}
