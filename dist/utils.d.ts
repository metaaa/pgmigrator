import { PoolClient } from "pg";
import { DatabaseMigration, FileSystemMigration, MigrationConfig } from "./customTypes";
export type MigratorParams = {
    client: PoolClient;
    tableName: string;
    migrationName: string;
};
export declare const RESULT_TYPE_SUCCESS = "SUCCESS";
export declare const RESULT_TYPE_FAILED = "FAILED";
/**
 * Checks to existence of the config file and grant type-safety usage
 */
export declare const getConfig: () => MigrationConfig;
/**
 * Creates the migrations table if not yet created
 */
export declare const setupIfNeeded: (params: Omit<MigratorParams, "migrationName">) => Promise<void>;
/**
 * Returns whether the given migration has already executed
 */
export declare const hasMigrationRun: (params: MigratorParams) => Promise<boolean>;
/**
 * Insert the migration into the DB
 */
export declare const markMigrationAsRun: (params: MigratorParams) => Promise<void>;
/**
 * Removes the migration from the db
 */
export declare const rollbackMigration: (params: MigratorParams) => Promise<void>;
/**
 * Returns array of migrations from the Fs
 */
export declare const loadMigrationsFromFs: (fsPath: string) => Promise<FileSystemMigration[]>;
/**
 * Returns array of successful migrations from the DB
 */
export declare const loadMigrationsFromDb: (params: Omit<MigratorParams, "migrationName">) => Promise<DatabaseMigration[]>;
/**
 * Returns array n last successful migrations from the DB
 */
export declare const loadMigrationsFromDbForRollback: (params: Omit<MigratorParams, "migrationName"> & {
    count: number;
}) => Promise<DatabaseMigration[]>;
/**
 * Release client connection and terminates process
 */
export declare const gracefullyExit: (client: PoolClient) => void;
/**
 * Wraps the gicen text with asterisks
 */
export declare const wrapTextWithAsterisk: (text: string) => void;
