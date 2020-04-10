export interface ApiRequestState {
  started: boolean;
  succeded: boolean;
  failed: boolean;
  errorCode?: string;
}
