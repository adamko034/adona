import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

admin.initializeApp();

export const toggleEmailVerified = functions.https.onRequest(async (req, res) => {
  try {
    const uid = req.query.uid;

    if (!uid) {
      throw new Error('uid missing');
    }

    const user = await admin.auth().getUser(uid);

    await admin.auth().updateUser(uid, {
      emailVerified: !user.emailVerified
    });
    console.log(`Toggled email verifed for user ${req.query.uid}, now is: ${!user.emailVerified}`);
    res.sendStatus(200);
  } catch (err) {
    console.error(`Toggling email verified for user ${req.query.uid} failed: ${err}`);
    res.sendStatus(400);
  }
});
