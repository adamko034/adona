import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Team } from 'src/app/core/team/model/team/team.model';
import { TeamFactory } from 'src/app/core/team/services/factory/team.factory';
import { firebaseConstants } from 'src/app/shared/constants/firebase/firebase-functions.constant';

@Injectable({ providedIn: 'root' })
export class TeamsFirebaseService {
  constructor(private functions: AngularFireFunctions, private teamFactory: TeamFactory) {}

  public getAll(): Observable<Team[]> {
    const callable = this.functions.httpsCallable(firebaseConstants.functions.team.getAll);
    return callable({}).pipe(map((teams) => this.teamFactory.listFromFirebase(teams)));
  }
}
