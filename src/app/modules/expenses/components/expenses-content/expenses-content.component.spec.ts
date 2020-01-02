import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensesContentComponent } from './expenses-content.component';

describe('ExpensesContentComponent', () => {
  let component: ExpensesContentComponent;
  let fixture: ComponentFixture<ExpensesContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpensesContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpensesContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
