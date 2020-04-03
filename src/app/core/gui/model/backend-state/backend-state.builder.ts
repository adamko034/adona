import { BackendState } from 'src/app/core/gui/model/backend-state/backend-state.model';

export class BackendStateBuilder {
  public static loading(): BackendState {
    return this.createBackendState(false, false, true);
  }

  public static success(): BackendState {
    return this.createBackendState(true, false, false);
  }

  public static failure(): BackendState {
    return this.createBackendState(false, true, false);
  }

  private static createBackendState(success: boolean, failure: boolean, loading: boolean): BackendState {
    return { loading, success, failure };
  }
}
