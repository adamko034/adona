import { MatDialog } from '@angular/material';
import { hot } from 'jasmine-marbles';
import { NewEventDialogComponent } from '../components/dialogs/new-event-dialog/new-event-dialog.component';
import { DialogResultTestDataBuilder } from '../utils/tests/dialog-result-test-data.builder';
import { EventsTestDataBuilder } from '../utils/tests/event-test-data.builder';
import { CalendarEventDialogService } from './calendar-event-dialog.service';

describe('Calendar Event Dialog Service', () => {
  const matDialog = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);
  const dialogResult = DialogResultTestDataBuilder.init()
    .withCancelResult()
    .build();

  let service: CalendarEventDialogService;
  let expectedResult;

  beforeEach(() => {
    service = new CalendarEventDialogService(matDialog);

    matDialog.open.calls.reset();

    expectedResult = hot('--a', { a: dialogResult });
    const dialogRef: any = {
      afterClosed: () => expectedResult
    };
    matDialog.open.and.returnValue(dialogRef);
  });

  it('should open mat dialog service', () => {
    // given
    const props = {
      component: NewEventDialogComponent,
      dialogProps: {
        width: '100px',
        data: { event: new EventsTestDataBuilder().addOneWithDefaultData().buildCalendarEvents()[0] }
      }
    };

    // when
    const result = service.open(props.component, props.dialogProps);

    // then
    expect(result).toBeObservable(expectedResult);
    expect(matDialog.open).toHaveBeenCalledTimes(1);
    expect(matDialog.open).toHaveBeenCalledWith(props.component, props.dialogProps);
  });
});
