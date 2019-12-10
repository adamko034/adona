import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  AfterViewChecked
} from '@angular/core';
import { CalendarEvent } from 'calendar-utils';
import { EventsGroupedByStartDate } from './model/events-grouped-by-start-date.model';
import { TimeService } from '../../../../../shared/services/time/time.service';
import { DateFormat } from '../../../../../shared/services/time/model/date-format.enum';

@Component({
  selector: 'app-calendar-view-list',
  templateUrl: './calendar-view-list.component.html',
  styleUrls: ['./calendar-view-list.component.scss']
})
export class CalendarViewListComponent implements OnInit, OnChanges, AfterViewChecked {
  @Input() events: CalendarEvent[];

  @Output() eventClicked = new EventEmitter<CalendarEvent>();
  @Output() nextMonth = new EventEmitter();
  @Output() previousMonth = new EventEmitter();

  eventsGrouped: EventsGroupedByStartDate[] = [];
  hideEmptyDays = false;
  startDateFormat = DateFormat.LongDayNameDayNumberLongMonthName;

  private scrollTo = '';
  private shouldScroll = false;

  constructor(public timeService: TimeService) {}

  ngOnInit() {
    this.calculateEventsGrouped();
  }

  ngOnChanges({ events: changes }: SimpleChanges) {
    this.calculateEventsGrouped();
    let newScrollTo = '';

    if (changes.previousValue) {
      newScrollTo = (+changes.previousValue[changes.previousValue.length - 1].start).toString();
    }

    this.shouldScroll = this.scrollTo !== newScrollTo;
    this.scrollTo = newScrollTo;
  }

  ngAfterViewChecked() {
    if (this.shouldScroll) {
      document.getElementById(this.scrollTo).scrollIntoView({ behavior: 'smooth' });
      this.shouldScroll = false;
    }
  }

  onLoadNext() {
    this.nextMonth.emit();
  }

  private calculateEventsGrouped() {
    this.eventsGrouped = [];
    this.events.forEach((event) => {
      let date = event.start;
      const end = event.end;

      do {
        let group = this.eventsGrouped.find((x) => this.timeService.Comparison.areDatesTheSame(x.start, date));

        if (!group) {
          group = {
            timestamp: +date,
            start: date,
            events: []
          };
          this.eventsGrouped.push(group);
        }

        group.events.push(event);

        date = this.timeService.Manipulation.addDays(1, date);
      } while (this.timeService.Comparison.isDateBeforeOrEqualThan(date, end));
    });

    this.eventsGrouped.sort((g1, g2) => g1.timestamp - g2.timestamp);
  }
}
