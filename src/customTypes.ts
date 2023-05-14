import { PoolConfig } from "pg";

export type MigrationConfig = {
  config: PoolConfig;
  database: {
    tableName: string;
  };
  fileSystem: {
    migrationsDir: string;
    outputDir: string;
    extension: string;
  };
};

export type DatabaseMigration = {
  id: number;
  name: string;
  created_at: string;
};

export type FileSystemMigration = {
  name: string;
  actions: { up: CallableFunction; down: CallableFunction };
};
