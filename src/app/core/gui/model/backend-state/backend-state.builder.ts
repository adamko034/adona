import { BackendState } from 'src/app/core/gui/model/backend-state/backend-state.model';

export class BackendStateBuilder {
  public static loading(): BackendState {
    return this.createBackendState(false, false, true);
  }

  public static success(): BackendState {
    return this.createBackendState(true, false, false);
  }

  public static failure(errorCode?: string): BackendState {
    const state = this.createBackendState(false, true, false);

    return errorCode ? { ...state, errorCode } : state;
  }

  private static createBackendState(success: boolean, failure: boolean, loading: boolean): BackendState {
    return { loading, success, failure };
  }
}
