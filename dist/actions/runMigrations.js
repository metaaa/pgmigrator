"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runMigrations = void 0;
const pg_1 = require("pg");
const utils_1 = require("../utils");
function runMigrations() {
    return __awaiter(this, void 0, void 0, function* () {
        const config = (0, utils_1.getConfig)();
        const pool = new pg_1.Pool(config.config);
        const client = yield pool.connect();
        try {
            yield (0, utils_1.setupIfNeeded)({ client, tableName: config.database.tableName });
            const migrations = yield (0, utils_1.loadMigrationsFromFs)(config.fileSystem.migrationsDir);
            for (const migration of migrations) {
                const params = {
                    client,
                    tableName: config.database.tableName,
                    migrationName: migration.name,
                };
                const alreadyRun = yield (0, utils_1.hasMigrationRun)(params);
                if (alreadyRun) {
                    continue;
                }
                try {
                    yield client.query("BEGIN");
                    yield client.query(migration.actions.up());
                    yield (0, utils_1.markMigrationAsRun)(params);
                    yield client.query("COMMIT");
                    console.log(`[SUCCESS] Migration executed: ${migration.name}.`);
                }
                catch (error) {
                    yield client.query("ROLLBACK");
                    console.error(`[ERROR] Failed to execute migration ${migration.name}.`);
                    console.error(error);
                    break;
                }
            }
        }
        catch (error) {
            console.error("[ERROR]", error);
        }
        finally {
            client.release();
            yield pool.end();
        }
    });
}
exports.runMigrations = runMigrations;
//# sourceMappingURL=runMigrations.js.map