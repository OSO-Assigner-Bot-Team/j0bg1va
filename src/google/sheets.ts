//this should use Oauth2 to display google sheets inside personal google drive

import { google } from 'googleapis';
import type { drive_v3 } from 'googleapis';
// import { OAuth2Client } from 'google-auth-library';
import { Readline, createInterface} from 'readline/promises';
import dotenv from 'dotenv';
import { auth, Credentials, OAuth2Client } from 'google-auth-library';
import * as fs from 'fs/promises';
import { error } from 'console';


dotenv.config();

const SCOPES = [
	'https://www.googleapis.com/auth/spreadsheets',
	'https://www.googleapis.com/auth/drive.metadata.readonly',
	'https://www.googleapis.com/auth/userinfo.email'
];

async function load_saved_credentials(oAuth2Client: OAuth2Client){
	try{
	let saved: Credentials = JSON.parse(await fs.readFile('credential_google.json','utf-8'));
	//check if refresh token exists
	if(saved.refresh_token == null){
		// throw new Error("refresh token doesn't exist");
		console.log("refresh token doesn't exist");
		return;
	}
	oAuth2Client.setCredentials(saved);
	return oAuth2Client;
	}
	catch(error){
		console.log(`Error loading the credential from JSON file: ${error}`)
		return null;
	}
};

// 2am stupid name
async function save_saved_credentials(oAuth2Client: OAuth2Client){
	await fs.writeFile('credential_google.json',JSON.stringify(oAuth2Client.credentials));
	console.log('credentials written to file.');
}






// function to handle auth flow. for some reason there isn't refresh token present and IDK why. 
async function authenticate(oAuth2Client: OAuth2Client){
	
	let isLoadedFlag:boolean = false;

	load_saved_credentials(oAuth2Client).then( async (value) => { 
		if(value == null){
			isLoadedFlag = true;
		}
});

	if(isLoadedFlag){
		await oAuth2Client.refreshAccessToken();
		// get user email (duplicate code)
		let user = google.oauth2({
			auth: oAuth2Client,
			version: 'v2'
		});
		let userinfo = await user.userinfo.get()
		console.log(`\nYou are logged in as: ${userinfo.data.email}`);
		save_saved_credentials(oAuth2Client);
		return;
	}




	
	// generate a link for admin to grant permissions for the bot
	let authLink = oAuth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: SCOPES,
	});

	// TODO send in discord DM the link to auth the automaton
	// console.log(authLink);
	authLink = `Click this link to authenticate:\n${authLink}\n`
	// TODO grab a code from a website and associate it with a user. 
	// Design the redirect flow

	let code: string;

	let rl = createInterface({
		input: process.stdin,
		output: process.stdout,
		
	});

	let answer = await rl.question(authLink);
	code = answer;
	//covert code into tokens and set them
	let { tokens } = await oAuth2Client.getToken(code);
	oAuth2Client.credentials = tokens
	
	// get user email(duplicate code)
	let user = google.oauth2({
		auth: oAuth2Client,
		version: 'v2'
	});
	let userinfo = await user.userinfo.get()
	console.log(`\nYou are logged in as: ${userinfo.data.email}`);
	save_saved_credentials(oAuth2Client);


} 

export async function setUpGoogleSheets() {
	// initialize the google auth to this specific bot
	const oAuth2Client = new google.auth.OAuth2(
		process.env.CLIENT_ID,
		process.env.CLIENT_SECRET,
		process.env.REDIRECT_URI
	);

	await authenticate(oAuth2Client);

	// refresh token when expired
	setInterval(function() {refreshToken(oAuth2Client)},10000);
	
	// TODO create google sheets file if not present

	// TODO Create a template for tables inside sheets

	// TODO upload data to sheets

	// TODO handle job creation

	// oAuth2Client.refreshAccessToken()
	// oAuth2Client.
	setInterval(async function() {
		console.log(Date.now())
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
	},600000);
}

function refreshToken(oAuth2Client: OAuth2Client){
	if(oAuth2Client.credentials.expiry_date == null ){
		// throw new TypeError('google auth expiry date not set');
		console.log('google auth expiry date not set')
		return;
	};
	let expiresAt: Date = new Date(oAuth2Client.credentials.expiry_date);
	let expiresIn: number = expiresAt.getTime() - Date.now();
	if(expiresIn < 30001){
		oAuth2Client.refreshAccessToken();
		console.log(`\ntriggered token refresh\nold expires at(ms): ${expiresAt}\nnew expires at(ms):${oAuth2Client.credentials.expiry_date}\n`);
		save_saved_credentials(oAuth2Client);
	}
	if(expiresIn > 3500000){
		console.log(`heartbeat: ${Date.now()}`)
		//========================
		//=========DANGER=========
		//========================
		// oAuth2Client.credentials.expiry_date = Date.now(); //TESTING FUNCTION REMOVE BEFORE PRODUCTION
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
