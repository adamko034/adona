import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';

export const get = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Unauthorized');
  }

  try {
    const db = admin.firestore();
    const userDoc = await db.collection('users').doc(context.auth.uid).get();
    const user = userDoc.data();

    const promises: Promise<DocumentSnapshot>[] = [];
    if (!user) {
      throw new functions.https.HttpsError('unauthenticated', 'Unauthorized');
    }
    user.teams.forEach((id: string) => {
      promises.push(db.collection('teams').doc(id).get());
    });

    const teamsSnapshot = await Promise.all(promises);
    const teams = teamsSnapshot
      .filter((teamSnapshot) => teamSnapshot.exists)
      .map((teamSnapshot) => {
        const { name } = teamSnapshot.data() as any;
        return { id: teamSnapshot.id, name };
      });

    return { ...user, id: context.auth.uid, teams };
  } catch (error) {
    console.log(error);
    throw new functions.https.HttpsError('internal', 'Unexpected error', error);
  }
});
