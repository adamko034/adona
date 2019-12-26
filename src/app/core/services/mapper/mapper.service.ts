import { Injectable } from '@angular/core';
import { CoreModule } from '@angular/flex-layout';
import { UsersMapper } from './parts/mapper.users';

@Injectable({
  providedIn: CoreModule
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
