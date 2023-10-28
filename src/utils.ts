import { promises } from "fs";
import { extname, resolve } from "path";
import { PoolClient } from "pg";
import {
  DatabaseMigration,
  FileSystemMigration,
  MigrationConfig,
} from "./customTypes";
import { MISSING_CONFIG_ERROR } from "./templates";

export type MigratorParams = {
  client: PoolClient;
  tableName: string;
  migrationName: string;
};

export const RESULT_TYPE_SUCCESS = "SUCCESS";

/**
 * Checks to existence of the config file and grant type-safety usage
 */
export const getConfig = (): MigrationConfig => {
  try {
    return require(resolve("./migrator.config.js"));
  } catch (error) {
    console.error(MISSING_CONFIG_ERROR);
    process.exit(0);
  }
};

/**
 * Creates the migrations table if not yet created
 */
export const setupIfNeeded = async (
  params: Omit<MigratorParams, "migrationName">
) => {
  await params.client.query(`CREATE TABLE IF NOT EXISTS ${params.tableName} (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
  )`);
};

/**
 * Returns whether the given migration has already executed
 */
export const hasMigrationRun = async (
  params: MigratorParams
): Promise<boolean> => {
  const result = await params.client.query(
    `SELECT name FROM ${params.tableName} WHERE name = $1`,
    [params.migrationName]
  );
  return result.rows.length !== 0;
};

/**
 * Insert the migration into the DB
 */
export const markMigrationAsRun = async (params: MigratorParams) => {
  await params.client.query(
    `INSERT INTO ${params.tableName} (name) VALUES($1)`,
    [params.migrationName]
  );
};

/**
 * Removes the migration from the db
 */
export const rollbackMigration = async (params: MigratorParams) => {
  await params.client.query(`DELETE FROM ${params.tableName} WHERE name = $1`, [
    params.migrationName,
  ]);
};

/**
 * Returns array of migrations from the Fs
 */
export const loadMigrationsFromFs = async (
  fsPath: string
): Promise<FileSystemMigration[]> => {
  const files = await promises.readdir(fsPath);

  return Promise.all(
    files
      .filter(
        (file) =>
          [".js", ".ts"].includes(extname(file)) &&
          !extname(file).includes(".map.")
      )
      .sort()
      .map(async (file) => {
        const filePath = resolve(fsPath, file);
        return { name: file, actions: require(filePath) };
      })
  );
};

/**
 * Returns array of successful migrations from the DB
 */
export const loadMigrationsFromDb = async (
  params: Omit<MigratorParams, "migrationName">
): Promise<DatabaseMigration[]> => {
  const result = await params.client.query(
    `SELECT * FROM ${params.tableName} ORDER BY id ASC`
  );
  return result.rows;
};

/**
 * Returns array n last successful migrations from the DB
 */
export const loadMigrationsFromDbForRollback = async (
  params: Omit<MigratorParams, "migrationName"> & { count: number }
): Promise<DatabaseMigration[]> => {
  const result = await params.client.query(
    `SELECT * FROM ${params.tableName} ORDER BY id DESC LIMIT ${params.count}`
  );
  return result.rows;
};

/**
 * Release client connection and terminates process
 */
export const gracefullyExit = (client: PoolClient): void => {
  client.release();
  process.exit(0);
};

/**
 * Wraps the gicen text with asterisks
 */
export const wrapTextWithAsterisk = (text: string) => {
  console.log("*".repeat(text.length + 4));
  console.log(`* ${text} *`);
  console.log("*".repeat(text.length + 4));
};
