import { Inject, Injectable } from '@angular/core';
import { SharedModule } from '../../shared.module';

@Injectable({ providedIn: SharedModule })
export class ScrollService {

  constructor(@Inject('Window') private window: Window, @Inject('Document') private document: Document) {}

  public scrollToTop() {
    this.window.scrollTo(0, 0);
  }

  public scrollToElement(elementId: string, offset: number = 0) {
    const el = this.document.getElementById(elementId);
    if (el) {
      el.scrollIntoView(true);
      this.window.scrollBy(0, offset);
    }
  }

  public scrollToBottom() {
    this.document.getElementById('footer').scrollIntoView();
  }
}
