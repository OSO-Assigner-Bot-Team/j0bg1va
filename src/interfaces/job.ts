import { Status } from "#root/enums/status";

export interface Job {
    uuid: string;
    description: string;
    attachments: string;
    claimant: string;
    thread: string;
    deadline: string;
    status: Status;
}
