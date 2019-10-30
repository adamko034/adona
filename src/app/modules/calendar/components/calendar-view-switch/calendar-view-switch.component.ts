import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CalendarView } from 'angular-calendar';

@Component({
  selector: 'app-calendar-view-switch',
  templateUrl: './calendar-view-switch.component.html',
  styleUrls: ['./calendar-view-switch.component.scss']
})
export class CalendarViewSwitchComponent implements OnInit {
  @Output() viewChanged = new EventEmitter<CalendarView>();

  CalendarView = CalendarView;
  view = CalendarView.Month;

  constructor() {}

  ngOnInit() {}

  setView(view: CalendarView) {
    this.view = view;
    this.viewChanged.emit(view);
  }
}
