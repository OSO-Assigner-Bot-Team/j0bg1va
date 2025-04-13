//this should use Oauth2 to display google sheets inside personal google drive

import { google } from 'googleapis';
// import type { drive_v3 } from 'googleapis';
// import { OAuth2Client } from 'google-auth-library';

const SCOPES = '';

async function setUpGoogleSheets() {
	// initialize the google auth to this specific bot
	const oAuth2Client = new google.auth.OAuth2(
		process.env.CLIENT_ID,
		process.env.CLIENT_SECRET,
		process.env.REDIRECT_URI
	);

	// generate a link for admin to grant permissions for the bot
	let authLink = oAuth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: SCOPES,
	});

	// TODO send in discord DM the link to auth the automaton
	console.log(authLink);
	// TODO user input the code through slash command or in a DM
	let code: string;
	oAuth2Client.getToken(code)
	// TODO refresh token when expired

	// TODO create google sheets file if not present
	
	// TODO Create a template for tables inside sheets 

	// TODO upload data to sheets

	// TODO handle job creation




}

// const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI)
// let access_token:string | null | undefined
// oAuth2Client.getToken()
// oAuth2Client.getAccessToken().then((value) => {access_token = value.token}).then(() => {
// 	oAuth2Client.setCredentials({access_token})
// 	console.log(access_token)

// 	//todo refresh token handling
// });

// function getNewToken(oAuth2Client, callback) {
// 	const authUrl = oAuth2Client.generateAuthUrl({
// 	  access_type: 'offline',
// 	  scope: SCOPES,
// 	});
// 	console.log('Authorize this app by visiting this url:', authUrl);
// 	const rl = readline.createInterface({
// 	  input: process.stdin,
// 	  output: process.stdout,
// 	});
// 	rl.question('Enter the code from that page here: ', (code) => {
// 	  rl.close();
// 	  oAuth2Client.getToken(code, (err, token) => {
// 		if (err) return console.error('Error retrieving access token', err);
// 		oAuth2Client.setCredentials(token);
// 		// Store the token to disk for later program executions
// 		fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
// 		  if (err) return console.error(err);
// 		  console.log('Token stored to', TOKEN_PATH);
// 		});
// 		callback(oAuth2Client);
// 	  });
// 	});
//   }

// oauth2Client.credentials.expiry_date

// oauth2Client.refreshAccessToken((error, token) => {
//     if (error) {
//       return
//     }
