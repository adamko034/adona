import { ApiRequestStatus } from 'src/app/core/api-requests/models/api-request-status/api-request-status.model';

export class ApiRequestStatusBuilder {
  public static start(id: string): ApiRequestStatus {
    return this.createBackendState(id, false, false, true);
  }

  public static success(id: string): ApiRequestStatus {
    return this.createBackendState(id, true, false, false);
  }

  public static fail(id: string, errorCode: string): ApiRequestStatus {
    return this.createBackendState(id, false, true, false, errorCode);
  }

  private static createBackendState(
    id: string,
    succeded: boolean,
    failed: boolean,
    started: boolean,
    errorCode?: string
  ): ApiRequestStatus {
    return { id, started, succeded, failed, errorCode: errorCode || null };
  }
}
