import { Renderer2 } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { ResponsiveMatIconDirective } from './responsive-mat-icon.directive';

describe('Responsive Mat Icon Directive', () => {
  const mediaObserver = jasmine.createSpyObj<MediaObserver>('mediaObserver', ['isActive']);
  const element = {
    nativeElement: jasmine.createSpy()
  };
  const renderer = jasmine.createSpyObj<Renderer2>('renderer', ['setStyle']);
  let directive: ResponsiveMatIconDirective;

  beforeEach(() => {
    directive = new ResponsiveMatIconDirective(element, mediaObserver, renderer);

    mediaObserver.isActive.calls.reset();
    renderer.setStyle.calls.reset();
  });

  it('should set small icon style', () => {
    // given
    mediaObserver.isActive.withArgs('lt-sm').and.returnValue(true);

    // when
    directive.ngOnInit();

    // then
    expect(mediaObserver.isActive).toHaveBeenCalledTimes(1);
    expect(mediaObserver.isActive).toHaveBeenCalledWith('lt-sm');
    expect(renderer.setStyle).toHaveBeenCalledTimes(1);
    expect(renderer.setStyle).toHaveBeenCalledWith(element.nativeElement, 'transform', 'scale(1)');
  });

  it('should set medium icon style', () => {
    // given
    mediaObserver.isActive.withArgs('lt-sm').and.returnValue(false);
    mediaObserver.isActive.withArgs('lt-lg').and.returnValue(true);

    // when
    directive.ngOnInit();

    // then
    expect(mediaObserver.isActive).toHaveBeenCalledTimes(2);
    expect(mediaObserver.isActive).toHaveBeenCalledWith('lt-sm');
    expect(mediaObserver.isActive).toHaveBeenCalledWith('lt-lg');
    expect(renderer.setStyle).toHaveBeenCalledTimes(1);
    expect(renderer.setStyle).toHaveBeenCalledWith(element.nativeElement, 'transform', 'scale(1.2)');
  });

  it('should set large icon style', () => {
    // given
    mediaObserver.isActive.withArgs('lt-sm').and.returnValue(false);
    mediaObserver.isActive.withArgs('lt-lg').and.returnValue(false);

    // when
    directive.ngOnInit();

    // then
    expect(mediaObserver.isActive).toHaveBeenCalledTimes(2);
    expect(mediaObserver.isActive).toHaveBeenCalledWith('lt-sm');
    expect(mediaObserver.isActive).toHaveBeenCalledWith('lt-lg');
    expect(renderer.setStyle).toHaveBeenCalledTimes(1);
    expect(renderer.setStyle).toHaveBeenCalledWith(element.nativeElement, 'transform', 'scale(1.5)');
  });
});
