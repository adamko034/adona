import { DialogAction } from '../enum/dialog-action.enum';

export interface DialogResult {
  action: DialogAction;
  payload?: any;
}
