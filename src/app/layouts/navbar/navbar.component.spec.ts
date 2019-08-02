import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthFacade } from '../../core/auth/auth.facade';
import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  const authFacadeSpy = jasmine.createSpyObj('AuthFacade', ['logout']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NavbarComponent],
      providers: [{ provide: AuthFacade, useValue: authFacadeSpy }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call facade on logout', () => {
    // given
    const facade = TestBed.get(AuthFacade);

    // when
    component.logout();

    // then
    expect(facade.logout).toHaveBeenCalledTimes(1);
  });
});
