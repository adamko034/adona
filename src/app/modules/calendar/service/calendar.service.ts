import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { CalendarMapper } from 'src/app/modules/calendar/mappers/calendar.mapper';
import { Event } from 'src/app/modules/calendar/model/event.model';
import { TimeService } from 'src/app/shared/services/time/time.service';

@Injectable()
export class CalendarService {
  constructor(private db: AngularFirestore, private mapper: CalendarMapper, private timeService: TimeService) {}
  private readonly collectionName: string = '/events';

  public addEvent(event: Event): Observable<Event> {
    const eventToAdd = { ...event, id: this.db.createId() };

    return from(
      this.db
        .collection<Event>(this.collectionName)
        .doc(eventToAdd.id)
        .set(eventToAdd)
        .then(() => eventToAdd)
    );
  }

  public updateEvent(event: Event): Observable<Event> {
    return from(
      this.db
        .collection(this.collectionName)
        .doc(event.id)
        .update(event)
        .then(() => event)
    );
  }

  public deleteEvent(id: string): Observable<void> {
    return from(this.db.collection(this.collectionName).doc(id).delete());
  }

  public getMonthEvents(date: Date, teamId: string): Observable<Event[]> {
    const startOfMonth = this.timeService.Extraction.getStartOfMonth(date);
    const endOfMonth = this.timeService.Extraction.getEndOfMonth(date);

    const collection = this.db.collection<Event>(this.collectionName, (doc) =>
      doc.where('teamId', '==', teamId).where('start', '>=', startOfMonth).where('start', '<=', endOfMonth)
    );

    return this.pushEventsFromCollection(collection);
  }

  private pushEventsFromCollection(collection: AngularFirestoreCollection<Event>): Observable<Event[]> {
    return collection.valueChanges({ idField: 'id' }).pipe(
      take(1),
      map((firebaseEvents) => this.mapper.Event.fromFirebaseEvents(firebaseEvents))
    );
  }
}
