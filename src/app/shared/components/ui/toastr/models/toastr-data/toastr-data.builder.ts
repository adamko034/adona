import { ToastrData } from 'src/app/shared/components/ui/toastr/models/toastr-data/toastr-data.model';
import { ToastrMode } from 'src/app/shared/components/ui/toastr/models/toastr-mode/toastr-mode.enum';
import { resources } from 'src/app/shared/resources/resources';

export class ToastrDataBuilder {
  private data: ToastrData;

  private constructor(private message: string, private mode: ToastrMode) {
    this.data = {
      message,
      mode,
      title: this.getTitle(mode)
    };
  }

  public static from(message: string, mode: ToastrMode): ToastrDataBuilder {
    return new ToastrDataBuilder(message, mode);
  }

  public withTitle(title: string): ToastrDataBuilder {
    this.data.title = title;
    return this;
  }

  public build(): ToastrData {
    return this.data;
  }

  private getTitle(mode: ToastrMode): string {
    switch (mode) {
      case ToastrMode.ERROR:
        return resources.toastr.title.error;
      case ToastrMode.SUCCESS:
        return resources.toastr.title.success;
      case ToastrMode.WARNING:
        return resources.toastr.title.warning;
      default:
        return resources.toastr.title.info;
    }
  }
}
