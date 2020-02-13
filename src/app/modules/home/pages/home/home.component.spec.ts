import { of, Subject } from 'rxjs';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { HomeComponent } from './home.component';

describe('Home Component', () => {
  let component: HomeComponent;

  const { userFacade, teamFacade } = SpiesBuilder.init()
    .withUserFacade()
    .withTeamFacade()
    .build();

  beforeEach(() => {
    component = new HomeComponent(userFacade, teamFacade);

    teamFacade.selectSelectedTeam.and.returnValue(of(null));
    userFacade.selectUser.and.returnValue(of(null));
  });

  describe('On Init', () => {
    it('should load selected team and subscribe for both: team and user', () => {
      component.ngOnInit();

      expect(teamFacade.loadSelectedTeam).toHaveBeenCalledTimes(1);
      expect(userFacade.selectUser).toHaveBeenCalledTimes(1);
      expect(teamFacade.selectSelectedTeam).toHaveBeenCalledTimes(1);
    });
  });

  describe('On Destroy', () => {
    it('should unsubscribe all subscriptions', () => {
      (component as any).userSubscription = new Subject();
      (component as any).teamSubscription = new Subject();

      const userSubscriptionSpy = spyOn((component as any).userSubscription, 'unsubscribe');
      const teamSubscriptionSpy = spyOn((component as any).teamSubscription, 'unsubscribe');

      component.ngOnDestroy();

      expect(userSubscriptionSpy).toHaveBeenCalledTimes(1);
      expect(teamSubscriptionSpy).toHaveBeenCalledTimes(1);
    });
  });
});
