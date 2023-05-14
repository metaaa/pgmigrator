import { Pool } from "pg";
import {
  getConfig,
  loadMigrationsFromDbForRollback,
  loadMigrationsFromFs,
} from "../utils";
import { DatabaseMigration, FileSystemMigration } from "../customTypes";

export const rollbackMigrationsByCount = async (
  count: string
): Promise<void> => {
  const config = getConfig();
  const pool = new Pool(config.config);
  const client = await pool.connect();

  let parsedCount = 1;
  if (!isNaN(parseInt(count))) {
    parsedCount = parseInt(count);
  }

  const params = {
    client,
    tableName: config.database.tableName,
    count: parsedCount,
  };

  try {
    const dbMigrations = await loadMigrationsFromDbForRollback(params);
    const dbMigrationNames = dbMigrations.map(
      (migration: DatabaseMigration) => migration.name
    );

    const fsMigrations = await loadMigrationsFromFs(
      config.fileSystem.migrationsDir
    );

    const fsMigrationsToRollback = fsMigrations.filter(
      (migration: FileSystemMigration) =>
        dbMigrationNames.includes(migration.name.split(".")[0])
    );

    for (const migration of fsMigrationsToRollback) {
      try {
        await client.query("BEGIN");
        await client.query(migration.actions.down());
        await client.query("COMMIT");
        console.log(`[SUCCESS] Migration rolled back: ${migration.name}.`);
      } catch (error) {
        await client.query("ROLLBACK");
        console.error(`[ERROR] Failed to execute migration roll back: ${migration.name}.`);
        console.error(error);
        break;
      }
    }
  } catch (error) {
    console.error("[ERROR]", error);
  } finally {
    client.release();
    await pool.end();
  }
};
