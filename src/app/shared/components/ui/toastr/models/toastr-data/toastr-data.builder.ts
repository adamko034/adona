import { ToastrData } from 'src/app/shared/components/ui/toastr/models/toastr-data/toastr-data.mode';
import { ToastrMode } from 'src/app/shared/components/ui/toastr/models/toastr-mode/toastr-mode.enum';

export class ToastrDataBuilder {
  private data: ToastrData;

  private constructor(private message: string, private mode: ToastrMode) {
    this.data = {
      message,
      mode
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
}
