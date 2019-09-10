import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { Event } from 'src/app/modules/calendar/model/event.model';
import { NewEventRequest } from '../model/new-event-request.model';

@Injectable()
export class CalendarService {
  private readonly collection: string = '/events';
  private readonly events: Event[] = [
    {
      id: '1',
      title: 'event 1',
      start: moment()
        .add(-1, 'd')
        .toDate(),
      end: moment().toDate(),
      allDay: false
    },
    {
      id: '2',
      title: 'event 2',
      start: moment()
        .add(1, 'd')
        .toDate(),
      end: moment()
        .add(2, 's')
        .toDate(),
      allDay: false
    },
    {
      id: '3',
      title: 'event 3',
      start: moment()
        .add(3, 'd')
        .toDate(),
      end: moment()
        .add(3, 'd')
        .add(1, 'h')
        .toDate(),
      allDay: false
    }
  ];

  constructor(private db: AngularFirestore, private) {}

  addEvent(newEvent: NewEventRequest): string {
    newEvent.id = this.db.createId();
    this.;
    return this.db.collection(this.collection).add(newEvent).then(res => res.);
  }

  getEvents(): Observable<Event[]> {
    return this.db.collection<Event>(this.collection).valueChanges();
  }
}
