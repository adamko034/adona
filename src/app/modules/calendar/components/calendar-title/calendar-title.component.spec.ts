import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CalendarModule, CalendarView, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import * as moment from 'moment';
import { CalendarTitleComponent } from './calendar-title.component';

describe('CelendarTitleComponent', () => {
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
    component.view = { view: CalendarView.Month, isList: false };

    // when
    fixture.detectChanges();

    // then
    h3 = fixture.nativeElement.querySelector('h3');
    expect(h3.textContent.trim()).toEqual(moment().format('MMMM YYYY'));
  });

  it('should show date on week view', () => {
    // given
    const dtNow = new Date();
    component.viewDate = dtNow;
    component.view = { view: CalendarView.Week, isList: false };

    // when
    fixture.detectChanges();

    // then
    h3 = fixture.nativeElement.querySelector('h3');
    const startOfWeek = moment()
      .startOf('isoWeek')
      .format('MMM D');
    const endOfWeek = moment()
      .endOf('isoWeek')
      .format('MMM D');
    const year = moment().format('YYYY');

    const expectedContent = `${startOfWeek} - ${endOfWeek}, ${year}`;

    expect(h3.textContent.trim()).toEqual(expectedContent);
  });

  it('should show date on day view', () => {
    // given
    const dtNow = new Date();
    component.viewDate = dtNow;
    component.view = { view: CalendarView.Day, isList: false };

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
    component.view = { view: CalendarView.Month, isList: true };

    // when
    fixture.detectChanges();

    // then
    h3 = fixture.nativeElement.querySelector('h3');
    expect(h3).toBeFalsy();
  });
});
