import { Pool } from "pg";
import { getConfig, hasMigrationRun, loadMigrationsFromFs, markMigrationAsRun, setupIfNeeded } from "../utils";

export async function runMigrations(): Promise<void> {
  const config = getConfig();
  const pool = new Pool(config.config);
  const client = await pool.connect();

  try {
    await setupIfNeeded({client, tableName: config.database.tableName})

    const migrations = await loadMigrationsFromFs(
      config.fileSystem.migrationsDir
    );

    for (const migration of migrations) {
      const params = {
        client,
        tableName: config.database.tableName,
        migrationName: migration.name,
      };

      const alreadyRun = await hasMigrationRun(params);

      if (alreadyRun) {
        continue;
      }

      try {
        await client.query("BEGIN");
        await client.query(migration.actions.up());
        await markMigrationAsRun(params);
        await client.query("COMMIT");
        console.log(`[SUCCESS] Migration executed: ${migration.name}.`);
      } catch (error) {
        await client.query("ROLLBACK");
        console.error(`[ERROR] Failed to execute migration ${migration.name}.`);
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
}
