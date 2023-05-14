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
exports.rollbackMigrationsByCount = void 0;
const pg_1 = require("pg");
const utils_1 = require("../utils");
const rollbackMigrationsByCount = (count) => __awaiter(void 0, void 0, void 0, function* () {
    const config = (0, utils_1.getConfig)();
    const pool = new pg_1.Pool(config.config);
    const client = yield pool.connect();
    let parsedCount = 1;
    if (!isNaN(parseInt(count))) {
        parsedCount = parseInt(count);
    }
    const params = {
        client,
        tableName: config.database.tableName,
        count: parsedCount,
    };
    try {
        const dbMigrations = yield (0, utils_1.loadMigrationsFromDbForRollback)(params);
        const dbMigrationNames = dbMigrations.map((migration) => migration.name);
        const fsMigrations = yield (0, utils_1.loadMigrationsFromFs)(config.fileSystem.migrationsDir);
        const fsMigrationsToRollback = fsMigrations.filter((migration) => dbMigrationNames.includes(migration.name.split(".")[0]));
        for (const migration of fsMigrationsToRollback) {
            try {
                yield client.query("BEGIN");
                yield client.query(migration.actions.down());
                yield client.query("COMMIT");
                console.log(`[SUCCESS] Migration rolled back: ${migration.name}.`);
            }
            catch (error) {
                yield client.query("ROLLBACK");
                console.error(`[ERROR] Failed to execute migration roll back: ${migration.name}.`);
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
exports.rollbackMigrationsByCount = rollbackMigrationsByCount;
//# sourceMappingURL=rollbackMigrations.js.map