import { Status } from '#root/enums/status';

export interface Job {
	uuid: string;
	description: string;
	attachments: string;
	claimant: string;
	thread: string;
	deadline: string; //TODO update the interface to use date type
	status: Status;
}
