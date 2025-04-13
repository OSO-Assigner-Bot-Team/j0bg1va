import { Job } from '#root/interfaces/job';
import { Client, ForumChannel, Guild } from 'discord.js';

export async function createThread(guild: Guild, client: Client, _channelId: string, job: Job) {
	client.on('ready', async () => {
		let forum = new ForumChannel(guild);
		// client.channels.fetch(channelId).then(async (channel: ForumChannel) => {
		// 	if(channel === null || channel === undefined){
		// 		throw new TypeError("channel is " + channel)
		// 	}
		const thread = await forum.threads.create({
			name: job.description,
			message: {
				content: `
						ID: ${job.uuid}
						Description: ${job.description}
						Attachments: ${job.attachments}
						Claimant: ${job.claimant}
						Deadline: ${job.deadline}
						Status: ${job.status}`,
			},
		});

		console.log(`Created thread: ${thread.name}`);
		// });
	});
}
