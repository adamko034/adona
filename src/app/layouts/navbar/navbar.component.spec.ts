import { AuthFacade } from '../../core/auth/auth.facade';
import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  const authFacade = jasmine.createSpyObj<AuthFacade>('AuthFacade', ['logout']);

  beforeEach(() => {
    component = new NavbarComponent(authFacade);
  });

  it('should call facade on logout', () => {
    // when
    component.logout();

    // then
    expect(authFacade.logout).toHaveBeenCalledTimes(1);
  });
});
