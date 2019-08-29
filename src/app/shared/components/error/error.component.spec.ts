import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material';
import { ErrorFacade } from 'src/app/core/error/error.facade';
import { ErrorComponent } from './error.component';

describe('Error Component', () => {
  let component: ErrorComponent;
  let fixture: ComponentFixture<ErrorComponent>;
  const errorFacade = jasmine.createSpyObj('ErrorFacade', ['getErrors']);
  const snackBar = jasmine.createSpyObj('SnackBar', ['open']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatSnackBarModule],
      declarations: [ErrorComponent],
      providers: [{ provide: ErrorFacade, useValue: errorFacade }, { provide: MatSnackBar, useValue: snackBar }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    errorFacade.getErrors.calls.reset();
  });

  describe('On Init', () => {
    it('should subscribe to errors from facade', () => {
      // when
      component.ngOnInit();

      // then
      expect(errorFacade.getErrors).toHaveBeenCalledTimes(1);
    });
  });
});
