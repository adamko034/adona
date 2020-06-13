import { ToastrMode } from 'src/app/core/gui/model/toastr/toastr-mode/toastr-mode.enum';

export interface ToastrData {
  mode: ToastrMode;
  message: string;
  title: string;
}
