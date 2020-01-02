import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensesMobileComponent } from './expenses-mobile.component';

describe('ExpensesMobileComponent', () => {
  let component: ExpensesMobileComponent;
  let fixture: ComponentFixture<ExpensesMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpensesMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpensesMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
