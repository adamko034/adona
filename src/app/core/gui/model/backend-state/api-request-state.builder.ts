import { ApiRequestState } from 'src/app/core/gui/model/backend-state/api-request-state.model';

export class ApiRequestStateBuilder {
  public static start(): ApiRequestState {
    return this.createBackendState(false, false, true);
  }

  public static success(): ApiRequestState {
    return this.createBackendState(true, false, false);
  }

  public static fail(errorCode?: string): ApiRequestState {
    const state = this.createBackendState(false, true, false);

    return errorCode ? { ...state, errorCode } : state;
  }

  private static createBackendState(succeded: boolean, failed: boolean, started: boolean): ApiRequestState {
    return { started, succeded, failed };
  }
}
