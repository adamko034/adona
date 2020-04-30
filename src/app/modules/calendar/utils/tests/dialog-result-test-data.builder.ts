import { DialogAction } from '../../../../shared/enum/dialog-action.enum';
import { DialogResult } from '../../../../shared/services/dialogs/dialog-result.model';

export class DialogResultTestDataBuilder<T> {
  private dialogResult: DialogResult<T>;

  private constructor() {
    this.dialogResult = { action: DialogAction.SaveAdd };
  }

  public static init<T>(): DialogResultTestDataBuilder<T> {
    return new DialogResultTestDataBuilder<T>();
  }

  public withAction(action: DialogAction): DialogResultTestDataBuilder<T> {
    this.dialogResult.action = action;
    return this;
  }

  public withPayload(payload: any): DialogResultTestDataBuilder<T> {
    this.dialogResult.payload = payload;
    return this;
  }

  public withCancelResult(): DialogResultTestDataBuilder<T> {
    this.dialogResult.payload = null;
    this.dialogResult.action = DialogAction.Cancel;
    return this;
  }

  public build(): DialogResult<T> {
    return this.dialogResult;
  }
}
