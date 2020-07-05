import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';

interface Member {
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
  if (!teamId) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing team id');
  }

  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Unauthenticated');
  }

  try {
    const db = admin.firestore();
    return await getTeam(teamId, db, true);
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

  const teamsId: string[] = user.teams;
  const promises: Promise<Team>[] = [];
  teamsId.forEach((teamId) => promises.push(getTeam(teamId, db, false)));

  return await Promise.all(promises);
});

async function getTeam(teamId: string, db: FirebaseFirestore.Firestore, includeMembers: boolean): Promise<Team> {
  const teamDoc = await db.collection('teams').doc(teamId).get();
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

        return { name: member.name, photoUrl: member.photoUrl };
      });
  }

  const result: Team = { id: teamId, name: team.name, created: team.created, createdBy };
  if (includeMembers) {
    result.members = members;
  }

  return Promise.resolve(result);
}
