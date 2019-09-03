import { dayHours } from 'src/app/shared/utils/time/time.const';
import { KeyValue } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable()
export class DayHoursService {
  public getAll(): KeyValue<number, string>[] {
    return dayHours;
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
