import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CalendarView } from 'angular-calendar';
import { AdonaCalendarView } from 'src/app/modules/calendar/model/adona-calendar-view.model';
import { Views } from 'src/app/modules/calendar/components/calendar-view-switch/model/calendar-view-switch-views.enum';

@Component({
  selector: 'app-calendar-view-switch',
  templateUrl: './calendar-view-switch.component.html',
  styleUrls: ['./calendar-view-switch.component.scss']
})
export class CalendarViewSwitchComponent implements OnInit {
  @Output() viewChanged = new EventEmitter<AdonaCalendarView>();

  public Views = Views;
  public view = this.Views.Month;

  constructor() {}

  public ngOnInit() {}

  public setView(newView: Views) {
    const viewToEmit = newView === Views.List ? this.convertEnum(this.view) : this.convertEnum(newView);
    this.view = newView;

    this.viewChanged.emit({ view: viewToEmit, isList: newView === this.Views.List });
  }

  private convertEnum(componentView: Views): CalendarView {
    switch (componentView) {
      case Views.Day:
        return CalendarView.Day;
      case Views.Week:
        return CalendarView.Week;
      case Views.Month:
        return CalendarView.Month;
      default:
        return CalendarView.Month;
    }
  }
}
