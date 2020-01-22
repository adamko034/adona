import { User } from '../../../core/user/model/user-model';

export interface Team {
  id: string;
  name: string;
  users?: User[];
}
