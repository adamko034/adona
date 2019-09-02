import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Event } from 'src/app/modules/calendar/model/event.model';
import * as moment from 'moment';

@Injectable()
export class CalendarService {
  private readonly events = [
    {
      id: '1',
      title: 'event 1',
      start: moment()
        .add(-1, 'd')
        .toDate()
    },
    {
      id: '2',
      title: 'event 2',
      start: moment()
        .add(1, 'd')
        .toDate()
    },
    {
      id: '3',
      title: 'event 3',
      start: moment()
        .add(3, 'd')
        .toDate()
    }
  ];

  addEvent(event: Event) {
    this.events.push(event);
  }

  getEvents(): Observable<Event[]> {
    return of(this.events);
  }
}
