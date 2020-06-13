import { ToastrService } from 'ngx-toastr';
import { ToastrData } from 'src/app/core/gui/model/toastr/toastr-data/toastr-data.model';
import { ToastrMode } from 'src/app/core/gui/model/toastr/toastr-mode/toastr-mode.enum';
import { ToastrAdonaService } from 'src/app/core/gui/services/toastr-adona-service/toastr-adona.service';
import { JasmineCustomMatchers } from 'src/app/utils/testUtils/jasmine-custom-matchers';

describe('Toastr Adona Service', () => {
  let service: ToastrAdonaService;

  const toastrSerivce = jasmine.createSpyObj<ToastrService>('toastrService', [
    'error',
    'warning',
    'success',
    'info',
    'clear'
  ]);

  beforeEach(() => {
    service = new ToastrAdonaService(toastrSerivce);
  });

  describe('Clear All', () => {
    it('should call origin Toastr Service Clear All method', () => {
      service.clearAll();

      expect(toastrSerivce.clear).toHaveBeenCalledTimes(1);
    });
  });

  describe('Show', () => {
    beforeEach(() => {
      toastrSerivce.info.calls.reset();
      toastrSerivce.warning.calls.reset();
      toastrSerivce.error.calls.reset();
      toastrSerivce.success.calls.reset();
    });

    it('should not show if data is empty', () => {
      service.show(null);
      assertToastrServiceCalls(null);
    });

    [
      { mode: ToastrMode.ERROR, title: 'err', message: 'err mess' },
      { mode: ToastrMode.INFO, title: 'inf', message: 'inf mess' },
      { mode: ToastrMode.SUCCESS, title: 'suc', message: 'suc mess' },
      { mode: ToastrMode.WARNING, title: 'err', message: 'warn mess' }
    ].forEach((data) => {
      it(`should call origin toastr service for mode: ${data.mode}`, () => {
        service.show(data);
        assertToastrServiceCalls(data);
      });
    });
  });

  function assertToastrServiceCalls(data: ToastrData) {
    if (data) {
      if (data.mode === ToastrMode.ERROR) {
        JasmineCustomMatchers.toHaveBeenCalledTimesWith(toastrSerivce.error, 1, data.message, data.title);
      }

      if (data.mode === ToastrMode.INFO) {
        JasmineCustomMatchers.toHaveBeenCalledTimesWith(toastrSerivce.info, 1, data.message, data.title);
      }

      if (data.mode === ToastrMode.WARNING) {
        JasmineCustomMatchers.toHaveBeenCalledTimesWith(toastrSerivce.warning, 1, data.message, data.title);
      }

      if (data.mode === ToastrMode.SUCCESS) {
        JasmineCustomMatchers.toHaveBeenCalledTimesWith(toastrSerivce.success, 1, data.message, data.title);
      }
    } else {
      expect(toastrSerivce.error).not.toHaveBeenCalled();
      expect(toastrSerivce.warning).not.toHaveBeenCalled();
      expect(toastrSerivce.success).not.toHaveBeenCalled();
      expect(toastrSerivce.info).not.toHaveBeenCalled();
    }
  }
});
