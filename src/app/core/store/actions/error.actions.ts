import { Action } from '@ngrx/store';
import { Error } from 'src/app/core/error/model/error.model';

export enum ErrorActionTypes {
  ErrorOccured = '[Error] Error Occured'
}

export class ErrorOccuredAction implements Action {
  readonly type = ErrorActionTypes.ErrorOccured;

  public constructor(public payload: { error: Error }) {}
}

export type ErrorActions = ErrorOccuredAction;
