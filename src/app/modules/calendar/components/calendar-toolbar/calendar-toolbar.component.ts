import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AdonaCalendarView } from '../../model/adona-calendar-view.model';

@Component({
  selector: 'app-calendar-toolbar',
  templateUrl: './calendar-toolbar.component.html',
  styleUrls: ['./calendar-toolbar.component.scss']
})
export class CalendarToolbarComponent implements OnInit {
  @Input() view: AdonaCalendarView;
  @Input() viewDate: Date;

  @Output() viewDateChanged = new EventEmitter<Date>();
  @Output() viewChanged = new EventEmitter<AdonaCalendarView>();
  @Output() newEventClicked = new EventEmitter();

  constructor() { }

  public ngOnInit() { }

  public onNewEventClicked() {
    this.newEventClicked.emit();
  }

  public onViewDateChanged(newViewDate: Date) {
    this.viewDateChanged.emit(newViewDate);
  }

  public onViewChanged(newView: AdonaCalendarView) {
    this.viewChanged.emit(newView);
  }
}
