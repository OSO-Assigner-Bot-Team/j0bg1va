//this should use Oauth2 to display google sheets inside personal google drive

import { google } from 'googleapis';
import type { drive_v3 } from 'googleapis';
// import { OAuth2Client } from 'google-auth-library';
import { Readline, createInterface} from 'readline/promises';
import dotenv from 'dotenv';
import { auth, OAuth2Client } from 'google-auth-library';


dotenv.config();

const SCOPES = [
	'https://www.googleapis.com/auth/spreadsheets',
	'https://www.googleapis.com/auth/drive.metadata.readonly',
];

export async function setUpGoogleSheets() {
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
	// console.log(authLink);
	authLink = `Click this link to authenticate:\n${authLink}\n`
	// TODO user input the code through slash command or in a DM
	// Design the redirect flow

	let code: string;

	let rl = createInterface({
		input: process.stdin,
		output: process.stdout,
		
	});

	let answer = await rl.question(authLink);
	code = answer;
	let { tokens } = await oAuth2Client.getToken(code);
	oAuth2Client.credentials = tokens
	
	// TODO refresh token when expired
	setInterval(function() {refreshToken(oAuth2Client)},10000);

	// TODO create google sheets file if not present

	// TODO Create a template for tables inside sheets

	// TODO upload data to sheets

	// TODO handle job creation

	// oAuth2Client.refreshAccessToken()
	// oAuth2Client.

	const drive = google.drive({ version: 'v3', auth: oAuth2Client });
	const res = await drive.files.list({
		pageSize: 10,
		fields: 'nextPageToken, files(id, name)',
	});
	if (res.data.files == undefined) {
		throw new TypeError("Baby don't hurt me!"); //fix the error handling
	}
	const files: drive_v3.Schema$File[] = res.data.files;
	if (files.length === 0) {
		console.log('No files found.');
		return;
	}

	console.log('Files:');
	files.map((file) => {
		console.log(`${file.name} (${file.id})`);
	});
}

function refreshToken(oAuth2Client: OAuth2Client){
	if(oAuth2Client.credentials.expiry_date == null ){
		throw new TypeError('google auth expiry date not set');
	};
	let expiresAt: Date = new Date(oAuth2Client.credentials.expiry_date);
	let expiresIn: number = expiresAt.getTime() - Date.now();
	if(expiresIn < 30001){
		oAuth2Client.refreshAccessToken();
		console.log(`\ntriggered token refresh\nold expires at(ms): ${expiresAt}\nnew expires at(ms):${oAuth2Client.credentials.expiry_date}\n`);
	}
	if(expiresIn > 3540000){
		console.log(`*`)
	}


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

// setUpGoogleSheets();
