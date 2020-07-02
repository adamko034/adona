import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';

export const get = functions.https.onCall(async (data, context) => {
  const teamId = data.id;
  if (!teamId) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing team id');
  }

  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Unauthenticated');
  }

  try {
    let createdBy = '';

    const db = admin.firestore();
    const teamDoc = await db.collection('teams').doc(teamId).get();
    const team = teamDoc.data() as any;

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
    const members = membersSnapshots
      .filter((m) => m.exists)
      .map((m) => {
        const member = m.data() as any;
        console.log('got user ' + m.id + ' ' + member.name);

        if (m.id === team.createdByUid) {
          createdBy = member.name;
        }

        return { name: member.name, photoUrl: member.photoUrl };
      });

    return {
      id: teamId,
      name: team.name,
      created: team.created,
      createdBy,
      members
    };
  } catch (error) {
    console.error(error);
    throw new functions.https.HttpsError('internal', 'Unknown error occured.', error);
  }
});
