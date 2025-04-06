import sqlite from 'node:sqlite';
import { Job } from '#root/interfaces/job';

export function createDb(dbFile: string) {
	return new sqlite.DatabaseSync(dbFile);
}

export function createTable(database: sqlite.DatabaseSync) {
	database.exec(`
      CREATE TABLE IF NOT EXISTS jobs (
        job_uuid TEXT PRIMARY KEY,
        description TEXT,
        attachments TEXT,
        claimant TEXT,
        thread TEXT,
        deadline TEXT,
        status TEXT
      ) STRICT
  `);
}

export function createJob(database: sqlite.DatabaseSync, job: Job) {
	const insert = database.prepare(
		'INSERT INTO jobs (job_uuid, description, attachments, claimant, thread, deadline, status) VALUES (?, ?, ?, ?, ?, ?, ?)'
	);
	insert.run(job.uuid, job.description, job.attachments, job.claimant, job.thread, job.deadline, job.status);
}

export function readTable(database: sqlite.DatabaseSync) {
	return database.prepare(`SELECT * FROM jobs`).all();
}

export function readJob(database: sqlite.DatabaseSync, jobUuid: Job["uuid"]) {
	return database.prepare(`SELECT * FROM jobs WHERE job_uuid = '${jobUuid}'`).get();
}

export function editJob(database: sqlite.DatabaseSync, newJob: Job) {
	database.exec(`
		UPDATE jobs
		SET description = ${newJob.description}, attachments = ${newJob.attachments}, claimant = ${newJob.claimant},
		thread = ${newJob.thread}, deadline = ${newJob.deadline}, status = ${newJob.status}
		WHERE job_uuid = '${newJob.uuid}'
	`);
}

export function removeJob(database: sqlite.DatabaseSync, jobUuid: Job["uuid"]) {
	database.exec(`DELETE FROM jobs WHERE job_uuid = ${jobUuid}`);
}
