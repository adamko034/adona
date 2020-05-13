import { ToastrMode } from 'src/app/shared/components/ui/toastr/models/toastr-mode/toastr-mode.enum';

export interface ToastrData {
  mode: ToastrMode;
  message: string;
  title?: string;
}
