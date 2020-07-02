import * as admin from 'firebase-admin';

admin.initializeApp();

export const teams = require('./team/team.functions');
export const sendInvitation = require('./invitations/invitation.functions');
export const user = require('./user/user.functions');
