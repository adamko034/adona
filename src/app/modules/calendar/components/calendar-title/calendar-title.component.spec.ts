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
    h3 = fixture.nativeElement.querySelector('h3');
  });

  it('should show date on month view', () => {
    // given
    const dtNow = new Date();
    component.viewDate = dtNow;
    component.view = CalendarView.Month;

    // when
    fixture.detectChanges();

    // then
    expect(h3.textContent).toBe(moment().format('MMMM YYYY'));
  });

  it('should show date on week view', () => {
    // given
    const dtNow = new Date();
    component.viewDate = dtNow;
    component.view = CalendarView.Week;

    // when
    fixture.detectChanges();

    // then
    const startOfWeek = moment()
      .startOf('week')
      .format('MMM DD');
    const endOfWeek = moment()
      .endOf('week')
      .format('MMM DD');
    const year = moment().format('YYYY');

    const expectedContent = `${startOfWeek} - ${endOfWeek}, ${year}`;

    expect(h3.textContent).toBe(expectedContent);
  });

  it('should show date on day view', () => {
    // given
    const dtNow = new Date();
    component.viewDate = dtNow;
    component.view = CalendarView.Day;

    // when
    fixture.detectChanges();

    // then
    expect(h3.textContent).toBe(moment().format('dddd, MMMM DD, YYYY'));
  });

  it('should show month view if not passed', () => {
    // when
    fixture.detectChanges();

    // then
    expect(h3.textContent).toBe(moment().format('MMMM YYYY'));
  });
});
