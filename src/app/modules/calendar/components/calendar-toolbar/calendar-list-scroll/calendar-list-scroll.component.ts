import { Component, OnInit } from '@angular/core';
import { ScrollService } from '../../../../../shared/services/scroll/scroll.service';
import { CalendarConstants } from '../../../utils/calendar-constants';
@Component({
  selector: 'app-calendar-list-scroll',
  templateUrl: './calendar-list-scroll.component.html',
  styleUrls: ['./calendar-list-scroll.component.scss']
})
export class CalendarListScrollComponent implements OnInit {
  constructor(private scrollService: ScrollService) {}

  public ngOnInit() {}

  public scrollToBottom() {
    this.scrollService.scrollToBottom();
  }

  public scrollToTop() {
    this.scrollService.scrollToTop();
  }

  public scrollToToday() {
    this.scrollService.scrollToElement(CalendarConstants.EventContainerTodayId, -50);
  }
}
