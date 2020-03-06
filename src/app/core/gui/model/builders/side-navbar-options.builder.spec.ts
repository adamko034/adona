import { SideNavbarOptions } from '../side-navbar-options.model';
import { SideNavbarOptionsBuilder } from './side-navbar-options.builder';

describe('Side Navbar Options Builder', () => {
  it('should build for desktop', () => {
    const expected: SideNavbarOptions = {
      mode: 'side',
      opened: true
    };
    expect(SideNavbarOptionsBuilder.forDesktop().build()).toEqual(expected);
  });

  it('should build for mobile', () => {
    const expected: SideNavbarOptions = {
      mode: 'over',
      opened: false
    };
    expect(SideNavbarOptionsBuilder.forMobile().build()).toEqual(expected);
  });

  it('should build from', () => {
    const expected: SideNavbarOptions = {
      mode: 'push',
      opened: false
    };
    expect(SideNavbarOptionsBuilder.from(expected.opened, expected.mode).build()).toEqual(expected);
  });
});
