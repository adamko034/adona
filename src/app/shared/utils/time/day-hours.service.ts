import { KeyValue } from '@angular/common';
import { Injectable } from '@angular/core';
import { timeConts } from 'src/app/shared/utils/time/time.const';

@Injectable()
export class DayHoursService {
  public getAll(): KeyValue<number, string>[] {
    return timeConts.dayHours;
  }

  public getGreaterOrEqualThen(hour: number) {
    return this.getAll().filter(x => x.key >= hour);
  }

  public getGreaterThen(hour: number) {
    return this.getAll().filter(x => x.key > hour);
  }

  public getLowerThan(hour: number) {
    return this.getAll().filter(x => x.key < hour);
  }

  public getLowerOrEqualThen(hour: number) {
    return this.getAll().filter(x => x.key <= hour);
  }
}
