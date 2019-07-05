import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CalendarViewSwitchComponent } from './calendar-view-switch.component';

describe('CelendarViewSwitchComponent', () => {
  let component: CalendarViewSwitchComponent;
  let fixture: ComponentFixture<CalendarViewSwitchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CalendarViewSwitchComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarViewSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
