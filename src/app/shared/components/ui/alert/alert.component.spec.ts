import { AlertComponent } from 'src/app/shared/components/ui/alert/alert.component';

describe('Alert Component', () => {
  let component: AlertComponent;

  beforeEach(() => {
    component = new AlertComponent();
  });

  describe('Get Icon', () => {
    it('should get icon', () => {
      component.mode = 'error';
      expect(component.icon).toEqual('error');

      component.mode = 'warning';
      expect(component.icon).toEqual('announcement');
    });
  });

  describe('Get Css Class', () => {
    it('should get css class', () => {
      component.mode = 'error';
      expect(component.cssClass).toEqual('alert-error');

      component.mode = 'warning';
      expect(component.cssClass).toEqual('alert-warning');
    });
  });
});
