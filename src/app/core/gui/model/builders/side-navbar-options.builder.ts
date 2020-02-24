import { SideNavbarOptions } from '../side-navbar-options.model';

export class SideNavbarOptionsBuilder {
  private state: SideNavbarOptions;

  constructor(opened: boolean, mode: 'push' | 'over' | 'side') {
    this.state = {
      opened,
      mode
    };
  }

  public static forMobile(): SideNavbarOptionsBuilder {
    return new SideNavbarOptionsBuilder(false, 'over');
  }

  public static forDesktop(): SideNavbarOptionsBuilder {
    return new SideNavbarOptionsBuilder(true, 'side');
  }

  public static from(opened: boolean, mode: 'push' | 'over' | 'side'): SideNavbarOptionsBuilder {
    return new SideNavbarOptionsBuilder(opened, mode);
  }

  public build(): SideNavbarOptions {
    return this.state;
  }
}
