import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent {
  @Input() message: string;
  @Input() mode: 'warning' | 'error' | 'info';

  public get icon() {
    switch (this.mode) {
      case 'warning':
        return 'announcement';
      case 'error':
        return 'error';
    }
  }

  public get cssClass() {
    return `alert-${this.mode}`;
  }

  constructor() {}
}
