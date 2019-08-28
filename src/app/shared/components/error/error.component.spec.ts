import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorComponent } from './error.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ErrorState } from 'src/app/core/store/reducers/error/error.reducer';
import { Store } from '@ngrx/store';
import { errorQueries } from 'src/app/core/store/selectors/error.selectors';
import { CommonModule } from '@angular/common';
import { cold } from 'jasmine-marbles';

describe('ErrorComponent', () => {
  let component: ErrorComponent;
  let fixture: ComponentFixture<ErrorComponent>;
  let mockStore: MockStore<ErrorState>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ErrorComponent],
      providers: [provideMockStore()]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.get<Store<ErrorState>>(Store);
    fixture.detectChanges();
  });

  describe('errors observable', () => {
    it('should have new error message', () => {
      // given
      mockStore.overrideSelector(errorQueries.selectErrorMessage, 'This is new error');
      const expected$ = cold('b', { b: 'This is new error' });

      // when
      component.ngOnInit();

      // then
      expect(component.errors$).toBeObservable(expected$);
    });
  });
});
