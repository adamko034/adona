import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FromToDatesComponent } from './from-to-dates.component';

describe('FromToDatesComponent', () => {
  let component: FromToDatesComponent;
  let fixture: ComponentFixture<FromToDatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FromToDatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FromToDatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
