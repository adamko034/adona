import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { from, Observable } from 'rxjs';
import { CredentialsLogin } from 'src/app/core/auth/model/credentials-login.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private fireAuth: AngularFireAuth) {}

  public getAuthState(): Observable<firebase.User> {
    return this.fireAuth.authState;
  }

  public login(credentials: CredentialsLogin): Observable<firebase.auth.UserCredential> {
    return from(this.fireAuth.auth.signInWithEmailAndPassword(credentials.email, credentials.password));
  }

  public logout(): Observable<void> {
    return from(this.fireAuth.auth.signOut());
  }
}
