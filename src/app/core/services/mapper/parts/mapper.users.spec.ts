import { UsersMapper } from './mapper.users';
import { UserTestBuilder } from 'src/app/utils/testUtils/builders/UserTestBuilder';

describe('Users Mapper', () => {
  it('should map from firebase user to user', () => {
    // given
    const firebaseUser = new UserTestBuilder().withDefaultData().buildFirebaseUser();
    const expectedUser = new UserTestBuilder().withDefaultData().build();

    // when
    const usersMapper = new UsersMapper();
    const result = usersMapper.toUser(firebaseUser);

    // then
    expect(result).toEqual(expectedUser);
  });
});
