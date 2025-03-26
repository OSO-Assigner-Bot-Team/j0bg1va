import { google } from 'googleapis';
import type { drive_v3 } from 'googleapis';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleAuth } from 'google-auth-library';

dotenv.config();

const credentials = JSON.parse(fs.readFileSync(process.env.GOOGLE_SECRET_FILENAME ?? '', 'utf8')); //this is lazy usage of ??

const auth = new google.auth.GoogleAuth({
	credentials,
	scopes: [
		'https://www.googleapis.com/auth/spreadsheets',
		'https://www.googleapis.com/auth/drive.metadata.readonly',
		'https://www.googleapis.com/auth/drive',
	],
});

// don't run it as every time it will create a new file and fill out the google drive
async function uploadTestFile(authClient: GoogleAuth) {
	const drive = google.drive({ version: 'v3', auth: authClient });

	const requestBody = {
		name: 'object-yellow.png',
		fields: 'id',
	};
	const media = {
		mimeType: 'image/png',
		body: fs.createReadStream('files/object-yellow.png'),
	};

	// as per documentation this should be used for files smaller than 5MB
	const file = await drive.files.create({
		requestBody,
		media: media,
	});
	console.log('File Id:', file.data.id);
}

async function listFiles(authClient: GoogleAuth) {
	const drive = google.drive({ version: 'v3', auth: authClient });
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

uploadTestFile(auth).then(async () => listFiles(auth));
