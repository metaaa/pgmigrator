"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MISSING_CONFIG_ERROR = exports.migrationFileContent = void 0;
exports.migrationFileContent = "export const up = async () => {\n  // TODO: Implement migration\n};\n\nexport const down = async () => {\n  // TODO: Implement rollback\n};\n";
exports.MISSING_CONFIG_ERROR = `
**********************
[ERROR] Migrator config file is missing.
Please create migrator.config.js inside the root of your project and provide the necessary informations.
**********************\n`;
//# sourceMappingURL=templates.js.map