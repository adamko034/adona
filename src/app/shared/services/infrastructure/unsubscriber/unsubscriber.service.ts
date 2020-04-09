import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UnsubscriberService {
  public create(): Subject<void> {
    return new Subject();
  }

  public complete(subject: Subject<void>): void {
    if (subject) {
      subject.next();
      subject.complete();
    }
  }
}
