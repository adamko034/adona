import { apiRequestActions, apiRequestsActionTypes } from 'src/app/core/store/actions/api-requests.actions';

describe('Api Requests actions', () => {
  describe('Request Start', () => {
    it('should create action', () => {
      expect({ ...apiRequestActions.requestStart({ id: '1' }) }).toEqual({
        type: apiRequestsActionTypes.requestStart,
        id: '1'
      });
    });
  });

  describe('Request Success', () => {
    it('should create action', () => {
      expect({ ...apiRequestActions.requestSuccess({ id: '1' }) }).toEqual({
        type: apiRequestsActionTypes.requestSuccess,
        id: '1'
      });
    });
  });

  describe('Request Fail', () => {
    it('should create action with error code', () => {
      expect({ ...apiRequestActions.requestFail({ id: '1', errorCode: 'testError' }) }).toEqual({
        type: apiRequestsActionTypes.requestFail,
        id: '1',
        errorCode: 'testError'
      });
    });

    it('should create action with null error code', () => {
      expect({ ...apiRequestActions.requestFail({ id: '1', errorCode: null }) }).toEqual({
        type: apiRequestsActionTypes.requestFail,
        id: '1',
        errorCode: null
      });
    });
  });
});
