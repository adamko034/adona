import { KeyValue } from '@angular/common';
import { Injectable } from '@angular/core';
import { timeConts } from './time.const';

@Injectable()
export class HourQuartersService {
  public getAll(): KeyValue<number, string>[] {
    return timeConts.hourQuarters;
  }

  public getGreaterThan(quarter: number): KeyValue<number, string>[] {
    return this.getAll().filter(x => x.key > quarter);
  }
}
