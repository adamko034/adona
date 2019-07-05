import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CalendarTitleComponent } from './calendar-title.component';

describe('CelendarTitleComponent', () => {
  let component: CalendarTitleComponent;
  let fixture: ComponentFixture<CalendarTitleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CalendarTitleComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
