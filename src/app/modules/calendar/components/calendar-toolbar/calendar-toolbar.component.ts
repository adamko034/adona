import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AdonaCalendarView } from 'src/app/modules/calendar/model/adona-calendar-view/adona-calendar-view.model';

@Component({
  selector: 'app-calendar-toolbar',
  templateUrl: './calendar-toolbar.component.html',
  styleUrls: ['./calendar-toolbar.component.scss']
})
export class CalendarToolbarComponent {
  @Input() view: AdonaCalendarView;
  @Input() viewDate: Date;

  @Output() newEventClicked = new EventEmitter();

  public onNewEventClicked() {
    this.newEventClicked.emit();
  }
}
