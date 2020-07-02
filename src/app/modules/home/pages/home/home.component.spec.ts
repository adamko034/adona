import { of } from 'rxjs';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { HomeComponent } from './home.component';

describe('Home Component', () => {
  let component: HomeComponent;

  const {
    userFacade,
    teamFacade,
    unsubscriberService
  } = SpiesBuilder.init().withUserFacade().withTeamFacade().withUnsubscriberService().build();

  beforeEach(() => {
    component = new HomeComponent(userFacade, teamFacade, unsubscriberService);

    teamFacade.selectTeam.and.returnValue(of(null));
    userFacade.selectUser.and.returnValue(of(null));
  });

  describe('Constructor', () => {
    it('should create unsubscriber', () => {
      expect(unsubscriberService.create).toHaveBeenCalled();
    });
  });

  describe('On Init', () => {
    it('should subscribe for both team and user', () => {
      component.ngOnInit();

      expect(userFacade.selectUser).toHaveBeenCalledTimes(1);
      expect(teamFacade.selectTeam).toHaveBeenCalledTimes(1);
    });
  });

  describe('On Destroy', () => {
    it('should unsubscribe all subscriptions', () => {
      component.ngOnDestroy();

      expect(unsubscriberService.complete).toHaveBeenCalledTimes(1);
    });
  });
});
