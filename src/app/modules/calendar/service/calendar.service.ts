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
    return from(
      this.db
        .collection<Event>(this.collectionName)
        .add(event)
        .then(ref => {
          return { ...event, id: ref.id };
        })
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

  public deleteEvent(id: string): Observable<string> {
    return from(
      this.db
        .collection(this.collectionName)
        .doc(id)
        .delete()
        .then(() => id)
    );
  }

  public getMonthEvents(date: Date): Observable<Event[]> {
    const startOfMonth = this.timeService.Extraction.getStartOfMonth(date);
    const endOfMonth = this.timeService.Extraction.getEndOfMonth(date);

    const collection = this.db.collection<Event>(this.collectionName, doc =>
      doc.where('start', '>=', startOfMonth).where('start', '<=', endOfMonth)
    );

    return this.pushEventsFromCollection(collection);
  }

  private pushEventsFromCollection(collection: AngularFirestoreCollection<Event>): Observable<Event[]> {
    return collection.valueChanges({ idField: 'id' }).pipe(
      take(1),
      map(firebaseEvents => this.mapper.Event.fromFirebaseEvents(firebaseEvents))
    );
  }
}
