import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CalendarView } from 'angular-calendar';

@Component({
  selector: 'app-calendar-toolbar',
  templateUrl: './calendar-toolbar.component.html',
  styleUrls: [ './calendar-toolbar.component.scss' ]
})
export class CalendarToolbarComponent implements OnInit {
  @Input() view: CalendarView;
  @Input() viewDate: Date;

  @Output() viewDateChanged = new EventEmitter<Date>();
  @Output() viewChanged = new EventEmitter<CalendarView>();
  @Output() newEventClicked = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  onNewEventClicked() {
    this.newEventClicked.emit();
  }

  onViewDateChanged(newViewDate: Date) {
    this.viewDateChanged.emit(newViewDate);
  }

  onViewChanged(newView: CalendarView) {
    this.viewChanged.emit(newView);
  }
}
