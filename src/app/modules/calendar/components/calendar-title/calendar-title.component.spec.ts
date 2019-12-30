import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CalendarModule, CalendarView, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import * as moment from 'moment';
import { CalendarTitleComponent } from './calendar-title.component';

describe('Celendar Title Component', () => {
  let component: CalendarTitleComponent;
  let fixture: ComponentFixture<CalendarTitleComponent>;
  let h3: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CalendarTitleComponent],
      imports: [
        CalendarModule.forRoot({
          provide: DateAdapter,
          useFactory: adapterFactory
        })
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarTitleComponent);
    component = fixture.componentInstance;
  });

  it('should show date on month view', () => {
    // given
    const dtNow = new Date();
    component.viewDate = dtNow;
    component.view = { calendarView: CalendarView.Month, isList: false };

    // when
    fixture.detectChanges();

    // then
    h3 = fixture.nativeElement.querySelector('h3');
    expect(h3.textContent.trim()).toEqual(moment().format('MMMM YYYY'));
  });

  it('should show date on week view for the same year', () => {
    // given
    const dtNow = new Date(2019, 10, 10);
    component.viewDate = dtNow;
    component.view = { calendarView: CalendarView.Week, isList: false };

    // when
    fixture.detectChanges();

    // then
    h3 = fixture.nativeElement.querySelector('h3');
    const startOfWeek = moment(dtNow)
      .startOf('isoWeek')
      .format('MMM D');
    const endOfWeek = moment(dtNow)
      .endOf('isoWeek')
      .format('MMM D');
    const year = moment(dtNow).format('YYYY');

    const expectedContent = `${startOfWeek} - ${endOfWeek}, ${year}`;

    expect(h3.textContent.trim()).toEqual(expectedContent);
  });

  it('should show date on week view for different year', () => {
    // given
    const date = new Date(2019, 11, 30);
    component.viewDate = date;
    component.view = { calendarView: CalendarView.Week, isList: false };

    // when
    fixture.detectChanges();

    // then
    h3 = fixture.nativeElement.querySelector('h3');
    const startOfWeek = moment(date)
      .startOf('isoWeek')
      .format('MMM D, YYYY');
    const endOfWeek = moment(date)
      .endOf('isoWeek')
      .format('MMM D, YYYY');

    const expectedContent = `${startOfWeek} - ${endOfWeek}`;

    expect(h3.textContent.trim()).toEqual(expectedContent);
  });

  it('should show date on day view', () => {
    // given
    const dtNow = new Date();
    component.viewDate = dtNow;
    component.view = { calendarView: CalendarView.Day, isList: false };

    // when
    fixture.detectChanges();

    // then
    h3 = fixture.nativeElement.querySelector('h3');
    expect(h3.textContent.trim()).toEqual(moment().format('dddd, MMMM D, YYYY'));
  });

  it('should show month view if not passed', () => {
    // when
    fixture.detectChanges();

    // then
    h3 = fixture.nativeElement.querySelector('h3');
    expect(h3.textContent.trim()).toEqual(moment().format('MMMM YYYY'));
  });

  it('should not show title if list view', () => {
    // given
    component.view = { calendarView: CalendarView.Month, isList: true };

    // when
    fixture.detectChanges();

    // then
    h3 = fixture.nativeElement.querySelector('h3');
    expect(h3).toBeFalsy();
  });
});
