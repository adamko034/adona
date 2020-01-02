import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensesDesktopComponent } from './expenses-desktop.component';

describe('ExpensesDesktopComponent', () => {
  let component: ExpensesDesktopComponent;
  let fixture: ComponentFixture<ExpensesDesktopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpensesDesktopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpensesDesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
