import { Event } from '../../model/event.model';

export class EventMapper {
  public fromFirebaseEvent(event: any): Event {
    return {
      id: event.id,
      allDay: event.allDay,
      end: new Date(event.end.seconds * 1000),
      start: new Date(event.start.seconds * 1000),
      title: event.title,
      created: new Date(event.created.seconds * 1000),
      createdById: event.createdById,
      createdBy: event.createdBy,
      teamId: event.teamId
    };
  }

  public fromFirebaseEvents(events: any[]): Event[] {
    return events.map((event) => {
      return this.fromFirebaseEvent(event);
    });
  }
}
