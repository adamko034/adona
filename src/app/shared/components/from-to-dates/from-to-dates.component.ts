import { KeyValue } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FromToDates } from 'src/app/shared/components/from-to-dates/model/from-to-dates.model';
import { TimeService } from 'src/app/shared/services/time/time.service';

@Component({
  selector: 'app-from-to-dates',
  templateUrl: './from-to-dates.component.html',
  styleUrls: ['./from-to-dates.component.scss']
})
export class FromToDatesComponent implements OnInit {
  @Input() start: Date;
  @Input() end: Date;
  @Input() allDay: boolean;
  @Output() dateChanged = new EventEmitter<FromToDates>();

  public startHour: number;
  public endHour: number;
  public startMinutes: number;
  public endMinutes: number;

  public startDate: Date;
  public endDate: Date;
  public startHoursOptions: KeyValue<number, string>[];
  public startMinutesOptions: KeyValue<number, string>[];
  public endHoursOptions: KeyValue<number, string>[];
  public endMinutesOptions: KeyValue<number, string>[];

  public endDateValid = true;

  public excludeLowerThanStartDate = (date: Date): boolean => {
    if (this.timeService.Comparison.areDatesTheSame(date, this.startDate)) {
      return !(this.startHour === 23 && this.startMinutes === 45);
    }

    return this.timeService.Comparison.isDateBeforeOrEqualThan(this.startDate, date);
    // tslint:disable-next-line: semicolon
  };

  constructor(private timeService: TimeService) {}

  ngOnInit() {
    this.startHoursOptions = this.timeService.DayHours.getAll();
    this.startMinutesOptions = this.timeService.HourQuarters.getAll();

    this.startDate = this.start || new Date();
    this.endDate = this.end || new Date();
    this.startHour = this.allDay ? new Date().getHours() : this.startDate.getHours();
    this.startMinutes = this.start ? this.start.getMinutes() : 0;
    this.endHour = this.end && !this.allDay ? this.end.getHours() : this.startHour + 1;
    this.endMinutes = this.end && !this.allDay ? this.end.getMinutes() : 0;

    this.adjustValuesAndEmit();
  }

  public allDayEventChanged() {
    if (this.isAtLeastOneValueNull()) {
      this.endDateValid = false;
      this.emitValue(null, null);
      return;
    }

    this.endDateValid = this.timeService.Comparison.isDateBeforeOrEqualThan(this.startDate, this.endDate);
    this.emitValue(this.getStartDateTime(), this.getEndDateTime());
  }

  public adjustValuesAndEmit() {
    if (this.isAtLeastOneValueNull()) {
      this.endDateValid = false;
      this.emitValue(null, null);
      return;
    }

    this.handleMidnight();

    let newEndHoursOptions = this.timeService.DayHours.getAll();
    let newEndMinutesOptions = this.timeService.HourQuarters.getAll();

    if (this.timeService.Comparison.isDateBefore(this.endDate, this.startDate)) {
      this.endDate = this.startDate;
    }

    if (this.timeService.Comparison.areDatesTheSame(this.startDate, this.endDate)) {
      newEndHoursOptions = this.timeService.DayHours.getGreaterOrEqualThen(this.startHour);

      if (this.startMinutes === 45) {
        newEndHoursOptions = this.timeService.DayHours.getGreaterThen(this.startHour);
      } else if (this.startHour === this.endHour) {
        newEndMinutesOptions = this.timeService.HourQuarters.getGreaterThan(this.startMinutes);
      }

      if (this.startHour >= this.endHour) {
        this.endHour = newEndHoursOptions[0].key;
        if (this.startMinutes >= this.endMinutes) {
          this.endMinutes = newEndMinutesOptions[0].key;
        }
      }

      if (this.timeService.Comparison.areDateHoursTheSame(this.getStartDateTime(), this.getEndDateTime())) {
        newEndMinutesOptions = this.timeService.HourQuarters.getGreaterThan(this.startMinutes);
        this.endMinutes = newEndMinutesOptions[0].key;
      }
    }

    this.endHoursOptions = newEndHoursOptions;
    this.endMinutesOptions = newEndMinutesOptions;

    this.endDateValid = this.timeService.Comparison.isDateTimeBefore(this.getStartDateTime(), this.getEndDateTime());

    this.emitValue(this.getStartDateTime(), this.getEndDateTime());
  }

  private handleMidnight() {
    if (
      this.timeService.Comparison.areDatesTheSame(this.startDate, this.endDate) &&
      this.startHour === 23 &&
      this.startMinutes === 45
    ) {
      this.endDate = this.timeService.Manipulation.addDays(1, this.endDate);
      this.endHour = 0;
      this.endMinutes = 0;
    }
  }

  private emitValue(from: Date, to: Date) {
    const value: FromToDates = { from, to, isAllDay: this.allDay };

    this.dateChanged.emit(value);
  }

  private getStartDateTime(): Date {
    if (this.allDay) {
      return this.timeService.Creation.getDateTimeFrom(this.startDate, 0, 0);
    }
    return this.timeService.Creation.getDateTimeFrom(this.startDate, this.startHour, this.startMinutes);
  }

  private getEndDateTime(): Date {
    if (this.allDay) {
      return this.timeService.Creation.getDateTimeFrom(this.endDate, 23, 59);
    }

    return this.timeService.Creation.getDateTimeFrom(this.endDate, this.endHour, this.endMinutes);
  }

  private isAtLeastOneValueNull(): boolean {
    return (
      this.startDate === null ||
      this.endDate === null ||
      this.startHour === null ||
      this.endHour === null ||
      this.startMinutes === null ||
      this.endMinutes === null
    );
  }
}
