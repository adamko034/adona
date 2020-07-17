import { Injectable } from '@angular/core';
import { UserDtoBuilder } from 'src/app/core/user/model/user/user-dto.builder';
import { UserDto } from 'src/app/core/user/model/user/user-dto.model';
import { UserBuilder } from 'src/app/core/user/model/user/user.builder';
import { User } from 'src/app/core/user/model/user/user.model';

@Injectable({ providedIn: 'root' })
export class UserFactory {
  public dtofromFirebaseAuth(firebaseAuth: firebase.User, invitationId: string, selectedTeamId: string): UserDto {
    const photoUrl = firebaseAuth.photoURL || UserBuilder.defaultPhotoUrl;
    return UserDtoBuilder.from(
      firebaseAuth.displayName,
      firebaseAuth.email,
      photoUrl,
      selectedTeamId,
      [selectedTeamId],
      selectedTeamId
    )
      .withInvitationId(invitationId)
      .build();
  }

  public fromFirebaseUser(firebaseUser: any): User {
    return UserBuilder.from(
      firebaseUser.id,
      firebaseUser.email,
      firebaseUser.name,
      firebaseUser.teams,
      firebaseUser.personalTeamId
    )
      .withSelectedTeamId(firebaseUser.selectedTeamId)
      .withPhotoUrl(firebaseUser.photoURL)
      .withInvitationId(firebaseUser.invitationId)
      .build();
  }
}
