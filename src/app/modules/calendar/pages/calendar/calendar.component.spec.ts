import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { CalendarView } from 'angular-calendar';
import { CoreModule } from 'src/app/core/core.module';
import { errorReducer } from 'src/app/core/store/reducers/error/error.reducer';
import { AdonaCalendarModule } from '../../calendar.module';
import { CalendarFacade } from '../../store/calendar.facade';
import { calendarReducer } from '../../store/reducers/calendar.reducer';
import { CalendarComponent } from './calendar.component';

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;
  let calendarFacade;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AdonaCalendarModule,
        BrowserAnimationsModule,
        CoreModule,
        StoreModule.forRoot({ calendar: calendarReducer, error: errorReducer }),
        EffectsModule.forRoot([])
      ],
      providers: [{ provide: CalendarFacade, useValue: jasmine.createSpyObj('CalendarFacade', ['loadAllEvents']) }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    calendarFacade = TestBed.get<CalendarFacade>(CalendarFacade);

    calendarFacade.loadAllEvents.calls.reset();
  });

  describe('OnInit', () => {
    it('should call for all events', () => {
      // when
      component.ngOnInit();

      // then
      expect(calendarFacade.loadAllEvents).toHaveBeenCalledTimes(1);
    });
  });

  it('should default to month view', () => {
    expect(component.view).toBe(CalendarView.Month);
    expect(component.viewDate.toDateString()).toBe(new Date().toDateString());
  });

  it('should change view type', () => {
    component.onViewChanged(CalendarView.Day);
    expect(component.view).toBe(CalendarView.Day);
    expect(component.viewDate.toDateString()).toBe(new Date().toDateString());

    component.onViewChanged(CalendarView.Week);
    expect(component.view).toBe(CalendarView.Week);
    expect(component.viewDate.toDateString()).toBe(new Date().toDateString());

    component.onViewChanged(CalendarView.Month);
    expect(component.view).toBe(CalendarView.Month);
    expect(component.viewDate.toDateString()).toBe(new Date().toDateString());
  });
});
