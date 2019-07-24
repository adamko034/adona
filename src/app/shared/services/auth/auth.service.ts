import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'firebase';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { CredentialsLogin } from '../../models/auth/credentials-login.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly authState$: Observable<User | null> = this.fireAuth.authState;

  constructor(private fireAuth: AngularFireAuth) {}

  public get user(): User | null {
    return this.fireAuth.auth.currentUser;
  }

  public login(
    credentials: CredentialsLogin
  ): Promise<firebase.auth.UserCredential> {
    return this.fireAuth.auth.signInWithEmailAndPassword(
      credentials.email,
      credentials.password
    );
  }

  public logout(): Promise<void> {
    return this.fireAuth.auth.signOut();
  }
}
