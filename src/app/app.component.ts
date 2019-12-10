import { Component } from '@angular/core';
import { CustomIconsService } from './core/services/angular-material/custom-icons/custom-icons.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent {
  constructor(private customIconsService: CustomIconsService) {
    this.customIconsService.init();
  }
}
