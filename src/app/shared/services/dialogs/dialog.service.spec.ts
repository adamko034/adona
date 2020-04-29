import { MatDialog } from '@angular/material/dialog';
import { hot } from 'jasmine-marbles';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { NewEventDialogComponent } from '../../../modules/calendar/components/dialogs/new-event-dialog/new-event-dialog.component';
import { DialogResultTestDataBuilder } from '../../../modules/calendar/utils/tests/dialog-result-test-data.builder';
import { EventsTestDataBuilder } from '../../../modules/calendar/utils/tests/event-test-data.builder';
import { DialogService } from './dialog.service';

describe('Calendar Event Dialog Service', () => {
  const matDialog = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);
  const { deviceDetectorService } = SpiesBuilder.init().withDeviceDetectorService().build();
  const dialogResult = DialogResultTestDataBuilder.init().withCancelResult().build();

  let service: DialogService;
  let expectedResult;

  beforeEach(() => {
    service = new DialogService(matDialog, deviceDetectorService);

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
        data: { event: EventsTestDataBuilder.from().addOneWithDefaultData().buildCalendarEvents()[0] }
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
