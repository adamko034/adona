import { of } from 'rxjs';
import { ToastrDataBuilder } from 'src/app/shared/components/ui/toastr/models/toastr-data/toastr-data.builder';
import { ToastrMode } from 'src/app/shared/components/ui/toastr/models/toastr-mode/toastr-mode.enum';
import { ToastrComponent } from 'src/app/shared/components/ui/toastr/toastr.component';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { JasmineCustomMatchers } from 'src/app/utils/testUtils/jasmine-custom-matchers';

describe('ToastrComponent', () => {
  let component: ToastrComponent;

  const {
    guiFacade,
    unsubscriberService,
    toastrService
  } = SpiesBuilder.init().withGuiFacade().withUnsubscriberService().withToastrService().build();

  beforeEach(() => {
    component = new ToastrComponent(guiFacade, unsubscriberService, toastrService);

    guiFacade.selectToastrData.calls.reset();
  });

  describe('Constructor', () => {
    it('should create unsubscriber', () => {
      unsubscriberService.create.calls.reset();
      component = new ToastrComponent(guiFacade, unsubscriberService, toastrService);

      expect(unsubscriberService.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('On Destroy', () => {
    it('should complete unsubscriber', () => {
      component.ngOnDestroy();

      expect(unsubscriberService.complete).toHaveBeenCalledTimes(1);
    });
  });

  describe('On Init', () => {
    it('should select Toastr Data', () => {
      guiFacade.selectToastrData.and.returnValue(of(null));
      component.ngOnInit();

      expect(guiFacade.selectToastrData).toHaveBeenCalledTimes(1);
    });

    describe('Toastr Data subscription', () => {
      [
        {
          toastr: ToastrDataBuilder.from('error', ToastrMode.ERROR).build(),
          spy: toastrService.error
        },
        {
          toastr: ToastrDataBuilder.from('info', ToastrMode.INFO).build(),
          spy: toastrService.info
        },
        {
          toastr: ToastrDataBuilder.from('success', ToastrMode.SUCCESS).withTitle('goog').build(),
          spy: toastrService.success
        },
        {
          toastr: ToastrDataBuilder.from('warning', ToastrMode.WARNING).withTitle('watch out').build(),
          spy: toastrService.warning
        }
      ].forEach((input) => {
        it(`should show ${input.toastr.message} toastr`, () => {
          guiFacade.selectToastrData.and.returnValue(of(input.toastr));
          component.ngOnInit();

          expect(guiFacade.selectToastrData).toHaveBeenCalledTimes(1);
          JasmineCustomMatchers.toHaveBeenCalledTimesWith(input.spy, 1, input.toastr.message, input.toastr.title);
        });
      });
    });
  });
});
