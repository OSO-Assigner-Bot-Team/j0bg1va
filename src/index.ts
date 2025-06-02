/**
    __/\\\\\\\\\\\\\\\___________________________________________________/\\\\\\_____________________________________________________________        
     _\///////\\\/////___________________________________________________\////\\\_____________________________________________________________       
      _______\/\\\____________________________________________/\\\\\\\\\_____\/\\\_______________________/\\\__________________________________      
       _______\/\\\___________/\\\\\\\\_____/\\\\\__/\\\\\____/\\\/////\\\____\/\\\_____/\\\\\\\\\_____/\\\\\\\\\\\_____/\\\\\\\\___/\\\\\\\\\\_     
        _______\/\\\_________/\\\/////\\\__/\\\///\\\\\///\\\_\/\\\\\\\\\\_____\/\\\____\////////\\\___\////\\\////____/\\\/////\\\_\/\\\//////__    
         _______\/\\\________/\\\\\\\\\\\__\/\\\_\//\\\__\/\\\_\/\\\//////______\/\\\______/\\\\\\\\\\_____\/\\\_______/\\\\\\\\\\\__\/\\\\\\\\\\_   
          _______\/\\\_______\//\\///////___\/\\\__\/\\\__\/\\\_\/\\\____________\/\\\_____/\\\/////\\\_____\/\\\_/\\__\//\\///////___\////////\\\_  
           _______\/\\\________\//\\\\\\\\\\_\/\\\__\/\\\__\/\\\_\/\\\__________/\\\\\\\\\_\//\\\\\\\\/\\____\//\\\\\____\//\\\\\\\\\\__/\\\\\\\\\\_ 
            _______\///__________\//////////__\///___\///___\///__\///__________\/////////___\////////\//______\/////______\//////////__\//////////__
                                                        A Project by ninjaninja140 to create useful project templates!
    
	@author ninjaninja140
	@name ts-docker-template
	
*/
import { Client, Events, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import http from 'http';
import { createDb, createTable } from './database/db.js';
import { createThread } from './discord/threads.js';
import { Job } from '#root/interfaces/job';
import { Status } from './enums/status.js';
import { setUpGoogleSheets } from './google/sheets.js';

dotenv.config();

console.log("DISCORD_TOKEN is", process.env.DISCORD_TOKEN ? "SET" : "NOT SET");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const PORT = parseInt(process.env.PORT || '8080', 10);

const server = http.createServer((_req, res) => {
	res.writeHead(200, { 'Content-Type': 'text/html' });
	res.end(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
	<p>
    <script>
        const codeParam = new URLSearchParams(document.location.search).get('code');
        const codeDiv = document.createElement('div').appendChild(document.createTextNode(codeParam));
        document.body.insertBefore(codeDiv, null);
		<!-- TODO fix trailing white characters here -->
    </script>
	</p>
	<p>
	<b>AUTOMATON IS ONLINE</b>
	</p>
</body>
</html>`);
});

server.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

const database = createDb('jobs.db');
createTable(database);

client.once(Events.ClientReady, (readyClient: { user: { tag: any } }) => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);

//example job

const testJob: Job = {
	uuid: 'deadbeef-5ef3-45f2-b31c-88ab7303741c',
	description: 'This is a test job',
	attachments:
		'https://raw.githubusercontent.com/OSO-Assigner-Bot-Team/OSO-Assigner-Bot-Team.github.io/refs/heads/main/images/object-green.png',
	claimant: '',
	thread: '',
	deadline: Date.now().toString(),
	status: Status.Claimable,
};

//create thread
// if (process.env.GUILD_ID === undefined) {
// 	throw new TypeError('guild is undefined');
// }
// const guild = client.guilds.cache.get(process.env.GUILD_ID);
// if (guild === undefined) {
// 	throw new TypeError('guild is undefined');
// }
try {
	// createThread(client, testJob);
} catch (error) {
	console.log(error);
}

setUpGoogleSheets();
