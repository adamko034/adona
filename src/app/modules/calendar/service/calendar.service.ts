import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Event } from 'src/app/modules/calendar/model/event.model';

@Injectable()
export class CalendarService {
  getEvents(): Observable<Event[]> {
    throw new Error('Method not implemented.');
  }
}
