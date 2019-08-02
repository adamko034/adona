import { AppState } from 'src/app/core/store/reducers';

const getAuth = (state: AppState) => state.auth;

export const authQuery = {
  getAuth
};
