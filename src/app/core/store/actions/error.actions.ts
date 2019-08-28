import { Action } from '@ngrx/store';

export enum ErrorActionTypes {
  ErrorOccured = '[Error] Error Occured'
}

export class ErrorOccuredAction implements Action {
  readonly type = ErrorActionTypes.ErrorOccured;

  public constructor(public payload: { message: string }) {}
}

export type ErrorActions = ErrorOccuredAction;
