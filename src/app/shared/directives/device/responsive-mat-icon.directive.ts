import { Directive, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';

@Directive({ selector: '[appResponsiveMatIcon]' })
export class ResponsiveMatIconDirective implements OnInit {
  private readonly small = 'lt-sm';
  private readonly medium = 'lt-lg';

  constructor(private elementRef: ElementRef, private mediaObserver: MediaObserver, private renderer: Renderer2) {}

  public ngOnInit() {
    if (this.mediaObserver.isActive(this.small)) {
      this.renderSmallIcon();
      return;
    }

    if (this.mediaObserver.isActive(this.medium)) {
      this.renderMediumIcon();
      return;
    }

    this.renderLargeIcon();
  }

  private renderSmallIcon() {
    this.renderer.setStyle(this.elementRef.nativeElement, 'transform', 'scale(1)');
  }

  private renderMediumIcon() {
    this.renderer.setStyle(this.elementRef.nativeElement, 'transform', 'scale(1.2)');
  }

  private renderLargeIcon() {
    this.renderer.setStyle(this.elementRef.nativeElement, 'transform', 'scale(1.5)');
  }
}
