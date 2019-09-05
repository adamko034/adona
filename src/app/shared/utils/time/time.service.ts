import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { DayHoursService } from 'src/app/shared/utils/time/day-hours.service';
import { HourQuartersService } from './hour-quarters.service';

@Injectable()
export class TimeService {
  public get now(): Date {
    return moment(new Date()).toDate();
  }

  public get nowHour(): number {
    return this.now.getHours();
  }

  public get DayHours(): DayHoursService {
    return this.dayHoursService;
  }

  public get HourQuarters(): HourQuartersService {
    return this.hourQuartersService;
  }

  public constructor(private dayHoursService: DayHoursService, private hourQuartersService: HourQuartersService) {}

  public isToday(date: Date): boolean {
    const startOfToday = moment(new Date()).startOf('day');

    return moment(date)
      .startOf('day')
      .isSame(startOfToday);
  }

  public isDateBefore(date: Date, secondDate: Date): boolean {
    return moment(date)
      .startOf('day')
      .isBefore(moment(secondDate).startOf('day'));
  }

  public isDateBeforeOrEqualThan(date: Date, secondDate: Date): boolean {
    return moment(date)
      .startOf('day')
      .isSameOrBefore(moment(secondDate).startOf('day'));
  }

  public areDatesTheSame(date: Date, secondDate: Date): boolean {
    return moment(date)
      .startOf('day')
      .isSame(moment(secondDate).startOf('day'));
  }

  public addDays(amount: number, date: Date) {
    return moment(date)
      .add(amount, 'day')
      .toDate();
  }
}
