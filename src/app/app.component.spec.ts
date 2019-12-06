import { AppComponent } from './app.component';
import { CustomIconsService } from './core/services/angular-material/custom-icons/custom-icons.service';

describe('App Component', () => {
  const customIconsServiceMock = jasmine.createSpyObj<CustomIconsService>('customIconsService', ['init']);

  it('should register custom icons on component creation', () => {
    // when
    // tslint:disable-next-line: no-unused-expression
    new AppComponent(customIconsServiceMock);

    // then
    expect(customIconsServiceMock.init).toHaveBeenCalledTimes(1);
  });
});
