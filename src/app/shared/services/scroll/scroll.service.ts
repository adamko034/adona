import { Injectable } from '@angular/core';
import { SharedModule } from '../../shared.module';

@Injectable({ providedIn: SharedModule })
export class ScrollService {
  public scrollToTop() {
    window.scrollTo(0, 0);
  }

  public scrollToElement(elementId: string, offset: number = 0) {
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView(true);
      window.scrollBy(0, offset);
    }
  }

  public scrollToBottom() {
    document.getElementById('footer').scrollIntoView();
  }
}
