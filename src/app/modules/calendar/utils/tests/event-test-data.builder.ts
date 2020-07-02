import { CalendarEvent } from 'calendar-utils';
import * as moment from 'moment';
import { User } from 'src/app/core/user/model/user/user.model';
import { Event } from 'src/app/modules/calendar/model/event.model';

export class EventsTestDataBuilder {
  private events: Event[];

  private constructor() {
    this.events = [];
  }

  public static from(): EventsTestDataBuilder {
    return new EventsTestDataBuilder();
  }

  public addOneWithUserData(user: User): EventsTestDataBuilder {
    this.events.push({
      id: this.events.length.toString(),
      title: 'Test Event' + this.events.length.toString(),
      start: new Date(),
      end: moment().add(1, 'h').toDate(),
      allDay: false,
      created: new Date(),
      createdBy: user.name,
      createdById: user.id,
      teamId: user.selectedTeamId
    });

    return this;
  }

  public addOneWithDefaultData(): EventsTestDataBuilder {
    this.events.push({
      id: this.events.length.toString(),
      title: 'Test Event' + this.events.length.toString(),
      start: new Date(),
      end: moment().add(1, 'h').toDate(),
      allDay: false,
      created: new Date(),
      createdBy: 'user',
      createdById: 'user123',
      teamId: 'team123'
    });

    return this;
  }

  public buildEvents(): Event[] {
    return this.events;
  }

  public buildCalendarEvents(): CalendarEvent[] {
    return this.events.map(({ id, title, start, end, allDay }) => {
      return { id, title, start, end, allDay };
    });
  }

  public buildFirebaseEvents(): any[] {
    return this.events.map(({ id, title, start, end, allDay, created, createdById, teamId, createdBy }) => {
      return {
        id,
        title,
        start: { seconds: moment(start).get('seconds') },
        end: { seconds: moment(end).get('seconds') },
        allDay,
        created: { seconds: moment(created).get('seconds') },
        teamId,
        createdBy,
        createdById
      };
    });
  }
}
