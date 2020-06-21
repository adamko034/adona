import { of } from 'rxjs';
import { SettingsToolbar } from 'src/app/modules/settings/models/settings-toolbar/settings-toolbar.model';
import { SettingsComponent } from 'src/app/modules/settings/pages/settings/settings.component';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';

describe('Settings Component', () => {
  let component: SettingsComponent;

  const {
    routerFacade,
    unsubscriberService
  } = SpiesBuilder.init().withUnsubscriberService().withRouterFacade().build();

  beforeEach(() => {
    component = new SettingsComponent(routerFacade, unsubscriberService);

    unsubscriberService.create.calls.reset();
  });

  describe('Constructor', () => {
    it('should initial unsubscriber', () => {
      component = new SettingsComponent(routerFacade, unsubscriberService);
      expect(unsubscriberService.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('On Destroy', () => {
    it('should complete unsubscriber', () => {
      component.ngOnDestroy();
      expect(unsubscriberService.complete).toHaveBeenCalledTimes(1);
    });
  });

  describe('On Init', () => {
    it('should call router facade for data', () => {
      const data: SettingsToolbar = { title: 'testTitle', backButtonUrl: 'testUrl', subtitle: 'testSubtitle' };
      routerFacade.selectRouteData.and.returnValue(of(data));

      component.ngOnInit();

      expect(routerFacade.selectRouteData).toHaveBeenCalledTimes(1);
    });
  });
});
