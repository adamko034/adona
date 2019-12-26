import { ViewContainerRef } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { MobileHideDirective } from './mobile-hide.directive';

describe('Mobile Hide Directive', () => {
  let directive: MobileHideDirective;

  const templateRef: any = {};
  const viewContainer = jasmine.createSpyObj<ViewContainerRef>('ContainerRef', ['clear', 'createEmbeddedView']);
  const deviceService = jasmine.createSpyObj<DeviceDetectorService>('DeviceService', ['isMobile']);

  beforeEach(() => {
    directive = new MobileHideDirective(templateRef, viewContainer, deviceService);

    deviceService.isMobile.calls.reset();
    viewContainer.createEmbeddedView.calls.reset();
    viewContainer.clear.calls.reset();
  });

  it('should show element if not on mobile', () => {
    // given
    deviceService.isMobile.and.returnValue(false);

    // when
    directive.ngOnInit();

    // then
    expect(deviceService.isMobile).toHaveBeenCalledTimes(1);
    expect(viewContainer.createEmbeddedView).toHaveBeenCalledTimes(1);
    expect(viewContainer.createEmbeddedView).toHaveBeenCalledWith(templateRef);
    expect(viewContainer.clear).toHaveBeenCalledTimes(0);
  });

  it('should hide element if on mobile', () => {
    // given
    deviceService.isMobile.and.returnValue(true);

    // when
    directive.ngOnInit();

    // then
    expect(deviceService.isMobile).toHaveBeenCalledTimes(1);
    expect(viewContainer.createEmbeddedView).toHaveBeenCalledTimes(0);
    expect(viewContainer.clear).toHaveBeenCalledTimes(1);
  });
});
