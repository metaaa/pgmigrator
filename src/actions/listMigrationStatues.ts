import { Pool } from "pg";
import { DatabaseMigration, FileSystemMigration } from "../customTypes";
import {
  RESULT_TYPE_SUCCESS,
  getConfig,
  gracefullyExit,
  loadMigrationsFromDb,
  loadMigrationsFromFs,
} from "../utils";

export const listMigrationStatuses = async (): Promise<void> => {
  const config = getConfig();
  const pool = new Pool(config.config);
  const client = await pool.connect();

  const params = {
    client,
    tableName: config.database.tableName,
  };

  try {
    const migrationsFromDB = await loadMigrationsFromDb(params);
    const migrationsFromFiles = await loadMigrationsFromFs(
      config.fileSystem.migrationsDir
    );

    if (migrationsFromFiles.length + migrationsFromDB.length === 0) {
      console.error("[WARN] There are no migrations to run...");
      gracefullyExit(client);
    }

    console.log(`| ${'MIGRATION NAME'.padEnd(80)} | ${'STATUS'.padEnd(7)} |`);

    const dbMigrations = migrationsFromDB.map((migration: DatabaseMigration) =>
      migration.name
    );

    const fsMigrations = migrationsFromFiles.map(
      (migration: FileSystemMigration) => migration.name.split(".")[0]
    );

    for (const dbMigration of dbMigrations) {
      console.log(`| ${dbMigration.padEnd(80)} | ${RESULT_TYPE_SUCCESS.padEnd(7)} |`);
    }
    
    for (const fsMigration of fsMigrations) {
      if (dbMigrations.includes(fsMigration)) {
        continue;
      }

      console.log(`| ${fsMigration.padEnd(80)} | ${"".padEnd(7)} |`);
    }

    gracefullyExit(client);
  } catch (error) {
    console.error("[ERROR] ", error.message);
  }
};
