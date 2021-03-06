import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable()
export class CustomIconsService {
  constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {}

  init() {
    this.matIconRegistry.addSvgIcon(
      'calendar-month',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../../../assets/icons/calendar/calendar-month.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'calendar-week',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../../../assets/icons/calendar/calendar-week.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'calendar-day',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../../../assets/icons/calendar/calendar-day.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'calendar-list',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../../../assets/icons/calendar/calendar-list.svg')
    );
  }
}
