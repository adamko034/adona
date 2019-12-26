import { Directive, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

@Directive({ selector: '[appMobileHide]' })
export class MobileHideDirective implements OnInit {
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private deviceService: DeviceDetectorService
  ) {}

  public ngOnInit() {
    if (this.deviceService.isMobile()) {
      this.viewContainer.clear();
    } else {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
