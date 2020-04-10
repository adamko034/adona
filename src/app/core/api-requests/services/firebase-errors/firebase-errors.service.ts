import { Injectable } from '@angular/core';
import { firebaseErrorCodes } from 'src/app/core/api-requests/constants/firebase-errors.constants';

@Injectable({ providedIn: 'root' })
export class FirebaseErrorsService {
  public isErrorHandled(errorCode: string): boolean {
    const code = firebaseErrorCodes[errorCode];

    return code ? code : false;
  }
}
