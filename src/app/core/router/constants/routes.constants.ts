import { resources } from 'src/app/shared/resources/resources';
import { Route } from '../model/route.model';

export const routes: Route[] = [
  { id: 1, icon: 'home', name: 'Home', url: '/home' },
  { id: 2, icon: 'perm_contact_calendar', name: 'Calendar', url: '/calendar' },
  // { icon: 'attach_money', name: 'Expenses', url: '/expenses' },
  { id: 3, icon: 'settings', name: 'Settings', url: '/settings' }
];
export const settingsRoutes: Route[] = [
  {
    id: 2,
    icon: 'group',
    name: 'My Teams',
    url: '/settings/teams',
    description: resources.settings.teams.description,
    image: resources.settings.teams.imageUrl
  },
  {
    id: 1,
    icon: 'account_box',
    name: 'Account',
    url: '/settings/account',
    description: resources.settings.account.description,
    image: resources.settings.account.imageUrl
  }
];

const settings = {
  list: {
    name: resources.settings.list.title,
    url: '/settings'
  },
  myAccount: {
    name: resources.settings.account.title,
    url: '/settings/account',
    description: resources.settings.account.description,
    image: resources.settings.account.imageUrl
  },
  teams: {
    name: resources.settings.teams.title,
    url: '/settings/teams',
    description: resources.settings.teams.description,
    image: resources.settings.teams.imageUrl
  }
};

export const routesN = { settings };
