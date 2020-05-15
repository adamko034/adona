import { ToastrDataBuilder } from 'src/app/shared/components/ui/toastr/models/toastr-data/toastr-data.builder';
import { ToastrData } from 'src/app/shared/components/ui/toastr/models/toastr-data/toastr-data.mode';
import { ToastrMode } from 'src/app/shared/components/ui/toastr/models/toastr-mode/toastr-mode.enum';

describe('Toastr Data Builder', () => {
  it('should create from defaults', () => {
    expect(ToastrDataBuilder.from('test message', ToastrMode.SUCCESS).build()).toEqual(
      createToastrData('test message', ToastrMode.SUCCESS)
    );
  });

  it('should create with title', () => {
    expect(ToastrDataBuilder.from('test message', ToastrMode.SUCCESS).withTitle('test title').build()).toEqual(
      createToastrData('test message', ToastrMode.SUCCESS, 'test title')
    );
  });
});

function createToastrData(message, mode, title?): ToastrData {
  if (title) {
    return { message, mode, title };
  }

  return { message, mode };
}
