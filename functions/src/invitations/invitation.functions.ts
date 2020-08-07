import * as functions from 'firebase-functions';
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

const oauth = {
  clientId: '219251712640-t18nlffi5gt8hc02vff4bb0glcvo8nc1.apps.googleusercontent.com',
  clientSecret: 'o5EPtT-uH57NiKO4B-TpEAvr',
  refreshToken:
    '1//0fPwaem8n5TcwCgYIARAAGA8SNwF-L9IrSb6YlAlXNslcIbB2EhKx8F-2QgOVA6iYzU8jhwqI6dJsyCp2CJK6HX2JijPfPxnq2x0',
  redirectUri: 'https://developers.google.com/oauthplayground'
};

export const sendInvitation = functions.firestore.document('invitations/{id}').onCreate(async (snaphost, context) => {
  const oauthClient = new OAuth2(oauth.clientId, oauth.clientSecret, oauth.redirectUri);
  oauthClient.setCredentials({
    refresh_token: oauth.refreshToken
  });

  const tokens = await oauthClient.refreshAccessToken();
  const accessToken = tokens.credentials.access_token;
  const smtpTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: functions.config().gmail.email,
      clientId: oauth.clientId,
      clientSecret: oauth.clientSecret,
      refreshToken: oauth.refreshToken,
      accessToken: accessToken
    }
  });

  const invitation = snaphost.data();
  const docRef = snaphost.ref;

  if (invitation) {
    const url = `${functions.config().adona.url}/auth/login?inv=${context.params.id}`;
    const emailOption = {
      from: 'ADONA team <noreply@adona.com>',
      to: invitation.recipientEmail,
      subject: 'Invitation to ADONA',
      html: getMessage(invitation, url)
    };

    try {
      await smtpTransport.sendMail(emailOption);
      await docRef.update({ status: 'sent' });
      console.log(`Successfully sent invitation ${context.params.id} email to ${emailOption.to}`);
    } catch (error) {
      await docRef.update({ status: 'failed' });
      console.error(`Failed to send invitation ${context.params.id}: ${error}`);
    }
  }

  return null;
});

function getMessage(invitation: any, adonaUrl: string): string {
  return `
    <p>Hello ${invitation.recipientEmail}!</p>
    <p>${invitation.senderEmail} would like to have you in ADONA's team: ${invitation.teamName}</p>
    <p><a href=${adonaUrl}>Join NOW!</a></p>
    <br />
    Kind regards,<br />
    ADONA team
  `;
}
