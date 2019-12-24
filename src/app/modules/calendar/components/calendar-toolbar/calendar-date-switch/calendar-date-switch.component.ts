import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AdonaCalendarView } from 'src/app/modules/calendar/model/adona-calendar-view.model';

@Component({
  selector: 'app-calendar-date-switch',
  templateUrl: './calendar-date-switch.component.html',
  styleUrls: ['./calendar-date-switch.component.scss']
})
export class CalendarDateSwitchComponent implements OnInit {
  @Input() view: AdonaCalendarView;
  @Input() viewDate: Date;
  @Output() viewDateChanged = new EventEmitter<Date>();

  constructor() { }

  ngOnInit() { }

  onViewDateChanged() {
    this.viewDateChanged.emit(this.viewDate);
  }
}
