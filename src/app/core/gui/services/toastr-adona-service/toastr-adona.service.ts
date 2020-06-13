import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ToastrData } from 'src/app/core/gui/model/toastr/toastr-data/toastr-data.model';
import { ToastrMode } from 'src/app/core/gui/model/toastr/toastr-mode/toastr-mode.enum';

@Injectable({ providedIn: 'root' })
export class ToastrAdonaService {
  constructor(private toastrService: ToastrService) {}

  public show(data: ToastrData): void {
    if (data) {
      const { mode, message, title } = data;
      switch (mode) {
        case ToastrMode.ERROR:
          this.toastrService.error(message, title);
          break;
        case ToastrMode.WARNING:
          this.toastrService.warning(message, title);
          break;
        case ToastrMode.SUCCESS:
          this.toastrService.success(message, title);
          break;
        default:
          this.toastrService.info(message, title);
          break;
      }
    }
  }

  public clearAll(): void {
    this.toastrService.clear();
  }
}
