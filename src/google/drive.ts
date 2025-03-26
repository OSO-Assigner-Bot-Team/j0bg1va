import { google } from "googleapis";
import type { drive_v3 } from "googleapis";
import fs from "fs";
import dotenv from "dotenv"
import { GoogleAuth } from "google-auth-library";

dotenv.config();

const credentials = JSON.parse(fs.readFileSync(process.env.GOOGLE_SECRET_FILENAME ?? "", "utf8")); //this is lazy usage of ??

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/spreadsheets",'https://www.googleapis.com/auth/drive.metadata.readonly'],
});

async function listFiles(authClient: GoogleAuth) {
  const drive = google.drive({version: 'v3', auth: authClient});
  const res = await drive.files.list({
    pageSize: 10,
    fields: 'nextPageToken, files(id, name)',
  });
  if (res.data.files == undefined){
    throw new TypeError("Baby don't hurt me!")
  }
  const files: drive_v3.Schema$File[] = res.data.files ;
  if (files.length === 0) {
    console.log('No files found.');
    return;
  }

  console.log('Files:');
  files.map((file) => {
    console.log(`${file.name} (${file.id})`);
  });
}

listFiles(auth);
