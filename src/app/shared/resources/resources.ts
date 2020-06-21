const general = {
  errors: {
    message: 'Unknown error occured while processing your request. Please, try again later.'
  }
};

const toastr = {
  title: {
    success: 'Great!',
    error: 'Oops :(',
    warning: 'Hmmm...',
    info: 'FYI...'
  }
};

const team = {
  created: 'Team <strong><i>{1}</i></strong> has been created!',
  invitation: {
    sent: 'Invitations were sent!',
    sendingFailed: 'Error occured while sending invitations. Please, verify this on your team settings page.',
    acceptingFailed: 'Error occured while processing your invitation. Please, try again later.',
    rejected: 'Invitation is corrupted (has already been accepted?).',
    accepted: 'Invitation has been accepted. You can now collaborate to <strong><i>{1}</i></strong>'
  }
};

const settings = {
  list: {
    title: 'Settings'
  },
  teams: {
    title: 'Teams',
    description: 'Manage your teams',
    imageUrl: '/assets/images/settings_team.svg'
  },
  account: {
    title: 'My Account',
    description: 'Manage your profile data',
    imageUrl: '/assets/images/settings_account.svg'
  },
  security: {
    title: 'Security',
    description: 'Manage your security preferences',
    imageUrl: '/assets/images/settings_security.svg'
  }
};

export const resources = {
  general,
  team,
  toastr,
  settings
};
