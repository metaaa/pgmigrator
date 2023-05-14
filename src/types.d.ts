import { MigrationConfig as Config } from "./customTypes";

declare module "pgmigrator" {
  export type MigrationConfig = Config;
}
