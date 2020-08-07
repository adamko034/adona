import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';

interface Member {
  id?: string;
  name: string;
  photoUrl: string;
}

interface Team {
  id: string;
  name: string;
  created: any;
  createdBy: string;
  members?: Member[];
}

export const get = functions.https.onCall(async (data, context) => {
  const teamId = data.id;
  const includeMembers = true;

  if (!teamId) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing team id');
  }

  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Unauthenticated');
  }

  try {
    const db = admin.firestore();
    return await getTeam(teamId, db, includeMembers);
  } catch (error) {
    console.error(error);
    throw new functions.https.HttpsError('internal', 'Unknown error occured.', error);
  }
});

export const getAll = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Unauthenticated');
  }

  const db = admin.firestore();
  const { uid } = context.auth;
  const userDoc = await db.collection('users').doc(uid).get();
  const user = userDoc.data();

  if (!user) {
    throw new functions.https.HttpsError('unauthenticated', 'Unauthenticated');
  }

  try {
    const teamsId: string[] = user.teams;
    const promises: Promise<Team | null>[] = [];
    teamsId.forEach((teamId) => promises.push(getTeam(teamId, db, false)));

    return await Promise.all(promises);
  } catch (error) {
    console.error(error);
    throw new functions.https.HttpsError('internal', 'Unknown error occured.', error);
  }
});

export const remove = functions.firestore.document('teams/{id}').onDelete(async (snapshot, context) => {
  const teamId = context.params.id;
  console.log('removed team id: ' + teamId);

  try {
    if (teamId) {
      const db = admin.firestore();

      const membersDoc = db.collection('teamMembers').doc(teamId);
      const members = (await membersDoc.get()).data() as any;

      const membersUpdatesPromises: any = [];

      const usersId = Object.keys(members).filter((key: any) => !members[key].isVirtual);
      const virtualUsersId = Object.keys(members).filter((key: any) => members[key].isVirtual);

      usersId.forEach(async (userId) => {
        console.log('processing user id ' + userId);
        const userDoc = db.collection('users').doc(userId);

        const user = (await userDoc.get()).data() as any;

        const newTeams = [...user.teams.filter((userTeamId: string) => userTeamId !== teamId)];
        const selectedTeamId = user.selectedTeamId === teamId ? user.personalTeamId : user.selectedTeamId;

        const promise = userDoc.update({ teams: newTeams, selectedTeamId });
        membersUpdatesPromises.push(promise);
      });

      virtualUsersId.forEach((userId) => {
        console.log('processing virtual user id ' + userId);
        const promise = db.collection('virtualUsers').doc(userId).delete();

        membersUpdatesPromises.push(promise);
      });

      console.log('processing updates and removals');
      await Promise.all(membersUpdatesPromises);
      await membersDoc.delete();
    }
  } catch (error) {
    console.error(error);
    throw new functions.https.HttpsError('internal', 'Unknown error occured.', error);
  }
});

async function getTeam(teamId: string, db: FirebaseFirestore.Firestore, includeMembers: boolean): Promise<Team | null> {
  const teamDoc = await db.collection('teams').doc(teamId).get();

  if (teamDoc.exists) {
    const team = teamDoc.data() as any;
    let members: Member[] = [];

    const createdByDoc = await db.collection('users').doc(team.createdByUid).get();
    const createdBy = createdByDoc.data()?.name;

    if (includeMembers) {
      const teamMembersDoc = await db.collection('teamMembers').doc(teamId).get();
      const teamMembers = teamMembersDoc.data();
      const promises: Promise<DocumentSnapshot>[] = [];

      for (const userId in teamMembers) {
        console.log('team member ' + userId);
        console.log('will get user: ' + JSON.stringify(teamMembers[userId]));
        console.log('has own property ' + teamMembers.hasOwnProperty(userId));
        if (teamMembers.hasOwnProperty(userId) && teamMembers[userId].assigned) {
          teamMembers[userId].isVirtual
            ? promises.push(db.collection('virtualUsers').doc(userId).get())
            : promises.push(db.collection('users').doc(userId).get());
        }
      }

      const membersSnapshots = await Promise.all(promises);
      members = membersSnapshots
        .filter((m) => m.exists)
        .map((m) => {
          const member = m.data() as any;
          console.log('got user ' + m.id + ' ' + member.name);

          const res: Member = { id: m.id, name: member.name, photoUrl: member.photoUrl };
          return res;
        });
    }

    const result: Team = { id: teamId, name: team.name, created: team.created, createdBy };
    if (includeMembers) {
      result.members = members;
    }

    return Promise.resolve(result);
  }

  return Promise.resolve(null);
}
