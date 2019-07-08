import { Component, Input, OnInit } from '@angular/core';
import { CalendarView } from 'angular-calendar';

@Component({
  selector: 'app-celendar-title',
  templateUrl: './calendar-title.component.html',
  styleUrls: ['./calendar-title.component.scss']
})
export class CalendarTitleComponent implements OnInit {
  @Input() viewDate: Date;
  @Input() view: CalendarView;

  constructor() {}

  ngOnInit() {}
}
