import { settingsActions } from 'src/app/modules/settings/store/actions';

const types = {
  loadTeamsRequested: '[Settings Teams Page] Load Teams Requested',
  loadTeamsSuccess: '[Database API] Load Teams Success',
  loadTeamsFailure: '[Database API] Load Teams Failure'
};

describe('Settings Teams Actions', () => {
  describe('Load All Teams', () => {
    describe('Reqeusted', () => {
      it('should create action', () => {
        expect(settingsActions.teams.loadTeamsRequested()).toEqual({ type: types.loadTeamsRequested });
      });
    });

    describe('Success', () => {
      it('should create action', () => {
        expect(settingsActions.teams.loadTeamsSuccess({ teams: [] })).toEqual({
          type: types.loadTeamsSuccess,
          teams: []
        });
      });
    });

    describe('Failure', () => {
      it('should create action', () => {
        expect(settingsActions.teams.loadTeamsFailure({ error: {} })).toEqual({
          type: types.loadTeamsFailure,
          error: {}
        });
      });
    });
  });
});
