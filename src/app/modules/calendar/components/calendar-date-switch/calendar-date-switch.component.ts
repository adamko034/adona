import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CalendarView } from 'angular-calendar';

@Component({
  selector: 'app-calendar-date-switch',
  templateUrl: './calendar-date-switch.component.html',
  styleUrls: ['./calendar-date-switch.component.scss']
})
export class CalendarDateSwitchComponent implements OnInit {
  @Input() view: CalendarView;
  @Input() viewDate: Date;
  @Output() viewDateChanged = new EventEmitter<Date>();

  constructor() {}

  ngOnInit() {}

  public onViewDateChanged() {
    this.viewDateChanged.emit(this.viewDate);
  }
}
