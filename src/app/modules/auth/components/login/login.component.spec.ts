import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthFacade } from '../../auth.facade';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  const authFacadeSpy = jasmine.createSpyObj('AuthFacade', ['login']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        BrowserAnimationsModule
      ],
      providers: [{ provide: AuthFacade, useValue: authFacadeSpy }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should default to empty credentials', () => {
    expect(component.credentials.email).toBeFalsy();
    expect(component.credentials.password).toBeFalsy();
  });

  it('should call facade on login', () => {
    // given
    const facade = TestBed.get(AuthFacade);

    // when
    component.login();

    // then
    expect(facade.login).toHaveBeenCalledTimes(1);
  });
});
