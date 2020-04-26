export interface ApiRequestStatus {
  id: string;
  started: boolean;
  succeded: boolean;
  failed: boolean;
  errorCode?: string;
}
