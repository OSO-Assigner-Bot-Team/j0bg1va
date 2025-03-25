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
        thread TEXT
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

export function readJob(database: sqlite.DatabaseSync, jobUuid: string) {
	return database.prepare(`SELECT * FROM jobs WHERE job_uuid = ${jobUuid}`).all();
}
