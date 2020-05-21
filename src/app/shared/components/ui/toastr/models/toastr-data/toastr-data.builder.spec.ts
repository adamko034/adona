import { ToastrDataBuilder } from 'src/app/shared/components/ui/toastr/models/toastr-data/toastr-data.builder';
import { ToastrData } from 'src/app/shared/components/ui/toastr/models/toastr-data/toastr-data.model';
import { ToastrMode } from 'src/app/shared/components/ui/toastr/models/toastr-mode/toastr-mode.enum';
import { resources } from 'src/app/shared/resources/resources';

describe('Toastr Data Builder', () => {
  [
    { mode: ToastrMode.ERROR, title: resources.toastr.title.error },
    { mode: ToastrMode.INFO, title: resources.toastr.title.info },
    { mode: ToastrMode.WARNING, title: resources.toastr.title.warning },
    { mode: ToastrMode.SUCCESS, title: resources.toastr.title.success }
  ].forEach((input) => {
    it(`should create from defaults for mode ${input.mode.toString()}`, () => {
      expect(ToastrDataBuilder.from('test message', input.mode).build()).toEqual(
        createToastrData('test message', input.mode, input.title)
      );
    });
  });

  it('should create with title', () => {
    expect(ToastrDataBuilder.from('test message', ToastrMode.SUCCESS).withTitle('test title').build()).toEqual(
      createToastrData('test message', ToastrMode.SUCCESS, 'test title')
    );
  });
});

function createToastrData(message, mode, title): ToastrData {
  return { message, mode, title };
}
