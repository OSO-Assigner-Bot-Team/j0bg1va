import { Job } from "#root/interfaces/job";
import { Client } from "discord.js";

export async function createThread(client: Client, channelId: string, job: Job) {
    client.on('ready', () => {
        client.channels.fetch(channelId)
          .then(async channel => {
            const thread = await channel.threads.create({
                name: job.description,
                message: { content: `
ID: ${job.uuid}
Description: ${job.description}
Attachments: ${job.attachments}
Claimant: ${job.claimant}
Deadline: ${job.deadline}
Status: ${job.status}` },
            });
        
            console.log(`Created thread: ${thread.name}`);
          });
    });
}
