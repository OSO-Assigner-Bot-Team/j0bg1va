//this should use Oauth2 to display google sheets inside personal google drive 

import { google } from 'googleapis';
// import type { drive_v3 } from 'googleapis';
// import { OAuth2Client } from 'google-auth-library';




const oauth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI)
let access_token = oauth2Client.getAccessToken().then()


