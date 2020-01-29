import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FirebaseUtils {
  public convertToDate(timestampField: any): Date {
    if (timestampField && timestampField.seconds) {
      return new Date(timestampField.seconds * 1000);
    }
  }
}
