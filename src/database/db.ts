import sqlite from 'node:sqlite';

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

export function createJob(
	database: sqlite.DatabaseSync,
	description: string,
	attachments: string,
	claimant: string,
	thread: string,
	deadline: string,
	status: string
) {
	const insert = database.prepare(
		'INSERT INTO jobs (job_uuid, description, attachments, claimant, thread, deadline, status) VALUES (?, ?, ?, ?, ?, ?, ?)'
	);
	insert.run(crypto.randomUUID(), description, attachments, claimant, thread, deadline, status);
}

export function readTable(database: sqlite.DatabaseSync) {
	return database.prepare(`SELECT * FROM jobs`).all();
}

export function readJob(database: sqlite.DatabaseSync, jobUuid: string) {
	return database.prepare(`SELECT * FROM jobs WHERE job_uuid = '${jobUuid}'`).get();
}

export function editJob(database: sqlite.DatabaseSync, newJob: any[]) {
	database.exec(`
		UPDATE jobs
		SET description = ${newJob[1]}, attachments = ${newJob[2]}, claimant = ${newJob[3]},
		thread = ${newJob[4]}, deadline = ${newJob[5]}, status = ${newJob[6]}
		WHERE job_uuid = '${newJob[0]}'
	`);
}

export function removeJob(database: sqlite.DatabaseSync, jobUuid: string) {
	database.exec(`DELETE FROM jobs WHERE job_uuid = ${jobUuid}`);
}
