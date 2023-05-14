export const migrationFileContent = "export const up = async () => {\n  // TODO: Implement migration\n};\n\nexport const down = async () => {\n  // TODO: Implement rollback\n};\n";
export const MISSING_CONFIG_ERROR = `
************************************************************************************************************
* [ERROR] Migrator config file is missing.                                                                 *
* Please create migrator.config.js inside the root of your project and provide the necessary informations. *
************************************************************************************************************\n`