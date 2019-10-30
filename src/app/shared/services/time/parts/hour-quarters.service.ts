import { KeyValue } from '@angular/common';
import { timeConts } from '../time.const';

export class HourQuartersService {
  public getAll(): KeyValue<number, string>[] {
    return timeConts.hourQuarters;
  }

  public getGreaterThan(quarter: number): KeyValue<number, string>[] {
    if (quarter === 45) {
      return this.getAll();
    }

    return this.getAll().filter(x => x.key > quarter);
  }
}
