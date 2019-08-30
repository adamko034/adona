import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material';
import { of } from 'rxjs';
import { ErrorFacade } from 'src/app/core/error/error.facade';
import { ErrorComponent, ErrorContentComponent } from './error.component';

describe('Error Component', () => {
  let component: ErrorComponent;
  let fixture: ComponentFixture<ErrorComponent>;
  const errorFacade = jasmine.createSpyObj('ErrorFacade', ['getErrors']);
  const snackBar = jasmine.createSpyObj('SnackBar', ['openFromComponent']);

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

    errorFacade.getErrors.and.callFake(() => of('This is new error'));

    fixture.detectChanges();
    errorFacade.getErrors.calls.reset();
    snackBar.openFromComponent.calls.reset();
  });

  afterEach(() => {
    fixture.destroy();
  });

  describe('On Init', () => {
    it('should subscribe to errors from facade', () => {
      // when
      component.ngOnInit();

      // then
      expect(errorFacade.getErrors).toHaveBeenCalledTimes(1);
    });

    it('should open snack bar if new error occurs', () => {
      // when
      component.ngOnInit();

      // then
      expect(snackBar.openFromComponent).toHaveBeenCalledTimes(1);
      expect(snackBar.openFromComponent).toHaveBeenCalledWith(ErrorContentComponent, {
        duration: 5 * 1000,
        data: {
          message: 'This is new error'
        }
      });
    });

    it('should not open snack bar if message is null', () => {
      // given
      errorFacade.getErrors.and.returnValue(of(null));
      fixture.detectChanges();

      // when
      component.ngOnInit();

      // then
      expect(snackBar.openFromComponent).not.toHaveBeenCalled();
    });
  });

  describe('On Destroy', () => {
    it('should unsubscribe subscriptions', () => {
      // given
      const errorSubscriptionSpy = spyOn((component as any).errorsSubscription, 'unsubscribe');

      // when
      component.ngOnDestroy();

      // then
      expect(errorSubscriptionSpy).toHaveBeenCalledTimes(1);
    });
  });
});
