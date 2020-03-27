import { Route } from '../model/route.model';

export const routes: Route[] = [
  { id: 1, icon: 'home', name: 'Home', url: '/home' },
  { id: 2, icon: 'perm_contact_calendar', name: 'Calendar', url: '/calendar' },
  // { icon: 'attach_money', name: 'Expenses', url: '/expenses' },
  { id: 3, icon: 'settings', name: 'Settings', url: '/settings' }
];

export const settingsRoutes: Route[] = [
  { id: 2, icon: 'security', name: 'Security', url: '/settings/security' },
  { id: 1, icon: 'account_box', name: 'Account', url: '/settings/account' }
];
