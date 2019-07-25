import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarView } from 'angular-calendar';
import { AdonaCalendarModule } from '../../calendar.module';
import { CalendarComponent } from './calendar.component';

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AdonaCalendarModule, BrowserAnimationsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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
