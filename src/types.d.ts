import { MigrationConfig as Config } from "./customTypes";

declare module "@metaaa/pgmigrator" {
  export type MigrationConfig = Config;
}
