import { MigrationConfig as Config } from "./customTypes.js";

declare module "@metaaa/pgmigrator" {
  export type MigrationConfig = Config;
}
