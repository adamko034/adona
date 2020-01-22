import { DialogAction } from '../../../../shared/enum/dialog-action.enum';
import { DialogResult } from '../../../../shared/services/dialogs/dialog-result.model';
import { Event } from '../../model/event.model';

export class DialogResultTestDataBuilder {
  private dialogResult: DialogResult<Event>;

  private constructor() {
    this.dialogResult = { action: DialogAction.SaveAdd };
  }

  public static init(): DialogResultTestDataBuilder {
    return new DialogResultTestDataBuilder();
  }

  public withAction(action: DialogAction): DialogResultTestDataBuilder {
    this.dialogResult.action = action;
    return this;
  }

  public withPayload(payload: any): DialogResultTestDataBuilder {
    this.dialogResult.payload = payload;
    return this;
  }

  public withCancelResult(): DialogResultTestDataBuilder {
    this.dialogResult.payload = null;
    this.dialogResult.action = DialogAction.Cancel;
    return this;
  }

  public build(): DialogResult<Event> {
    return this.dialogResult;
  }
}
