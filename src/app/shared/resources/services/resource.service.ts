import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ResourceService {
  public format(format: string, ...values: string[]): string {
    let i = 1;
    let result = format;
    values.forEach((value) => {
      result = result.replace(`{${i++}}`, value);
    });

    return result;
  }
}
