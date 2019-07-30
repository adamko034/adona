import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'firebase';
import * as firebase from 'firebase/app';
import { Observable, from } from 'rxjs';
import { CredentialsLogin } from '../../models/auth/credentials-login.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly authState$: Observable<User | null> = this.fireAuth.authState;

  constructor(private fireAuth: AngularFireAuth) {}

  public login(
    credentials: CredentialsLogin
  ): Observable<firebase.auth.UserCredential> {
    return from(
      this.fireAuth.auth.signInWithEmailAndPassword(
        credentials.email,
        credentials.password
      )
    );
  }

  public logout(): Observable<void> {
    return from(this.fireAuth.auth.signOut());
  }
}
