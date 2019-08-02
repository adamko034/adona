import { Injectable } from '@angular/core';
import { UsersMapper } from './parts/mapper.users';

@Injectable({
  providedIn: 'root'
})
export class MapperService {
  private usersMapper: UsersMapper;

  public get Users(): UsersMapper {
    return this.usersMapper;
  }

  constructor() {
    this.usersMapper = new UsersMapper();
  }
}
