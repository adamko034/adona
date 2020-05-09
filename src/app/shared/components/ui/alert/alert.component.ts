import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {
  @Input() message: string;
  @Input() mode: 'warning' | 'error' | 'info';

  public get icon() {
    switch (this.mode) {
      case 'warning':
        return 'announcement';
    }
  }

  public get cssClass() {
    return `alert-${this.mode}`;
  }

  constructor() {}

  ngOnInit(): void {}
}
