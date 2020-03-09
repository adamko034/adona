import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { from, Observable } from 'rxjs';
import { Credentials } from 'src/app/core/auth/model/credentials.model';
import { UserUtilservice } from 'src/app/core/user/services/user-utils.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private fireAuth: AngularFireAuth, private userUtilsService: UserUtilservice) {}

  public getAuthState(): Observable<firebase.User> {
    return this.fireAuth.authState;
  }

  public login(credentials: Credentials): Observable<firebase.auth.UserCredential> {
    return from(this.fireAuth.auth.signInWithEmailAndPassword(credentials.email, credentials.password));
  }

  public logout(): Observable<void> {
    return from(this.fireAuth.auth.signOut());
  }

  public register(credentials: Credentials): Observable<firebase.User> {
    return from(
      this.fireAuth.auth
        .createUserWithEmailAndPassword(credentials.email, credentials.password)
        .then((userCredential: firebase.auth.UserCredential) => {
          const displayName = this.userUtilsService.extractUsernameFromEmail(userCredential.user.email);
          return userCredential.user.updateProfile({ displayName }).then(() => userCredential.user);
        })
    );
  }
}
