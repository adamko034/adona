import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent {
  @Input() visible: boolean;
  @Input() mode: 'overlay' | 'spinner';

  public get diameter(): number {
    if (this.mode === 'spinner') {
      return 40;
    }

    if (this.mode === 'overlay') {
      return 100;
    }
  }

  constructor() {}
}
