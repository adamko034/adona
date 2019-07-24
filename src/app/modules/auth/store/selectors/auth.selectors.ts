import { AppState } from 'src/app/store/reducers';

const getAuth = (state: AppState) => state.auth;
export const selectAuthState = state => {
  return state.auth;
};

export const authQuery = {
  getAuth
};
