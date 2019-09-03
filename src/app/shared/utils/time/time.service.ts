import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { DayHoursService } from 'src/app/shared/utils/time/day-hours.service';

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

  public constructor(private dayHoursService: DayHoursService) {}

  public isToday(date: Date) {
    const startOfToday = moment(new Date()).startOf('day');

    return moment(date)
      .startOf('day')
      .isSame(startOfToday);
  }
}
