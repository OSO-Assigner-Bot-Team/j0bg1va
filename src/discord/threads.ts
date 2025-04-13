import { Job } from '#root/interfaces/job';
import { Client, ChannelType } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

export async function createThread(client: Client, job: Job) {
	client.on('ready', async () => {
		if (process.env.FORUM_ID === undefined) {
			throw new TypeError('add FORUM_ID to dotenv!');
		}
		// let guild = client.guilds.cache.get(process.env.guildId)
		// if (guild === undefined) {
		// 	throw new TypeError('guild is undefined');
		// }
		// let forum = new ForumChannel(guild,);
		client.channels.fetch(process.env.FORUM_ID).then(async (channel) => {
			if (channel?.type !== ChannelType.GuildForum) {
				throw new TypeError('channel is ' + channel);
			}

			const thread = await channel.threads.create({
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
		});
	});
}
