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
exports.listMigrationStatuses = void 0;
const pg_1 = require("pg");
const utils_1 = require("../utils");
const listMigrationStatuses = () => __awaiter(void 0, void 0, void 0, function* () {
    const config = (0, utils_1.getConfig)();
    const pool = new pg_1.Pool(config.config);
    const client = yield pool.connect();
    const params = {
        client,
        tableName: config.database.tableName,
    };
    try {
        const migrationsFromDB = yield (0, utils_1.loadMigrationsFromDb)(params);
        const migrationsFromFiles = yield (0, utils_1.loadMigrationsFromFs)(config.fileSystem.migrationsDir);
        if (migrationsFromFiles.length + migrationsFromDB.length === 0) {
            console.error("[WARN] There are no migrations to run...");
            (0, utils_1.gracefullyExit)(client);
        }
        console.log(`| ${'MIGRATION NAME'.padEnd(80)} | ${'STATUS'.padEnd(7)} |`);
        const dbMigrations = migrationsFromDB.map((migration) => migration.name);
        const fsMigrations = migrationsFromFiles.map((migration) => migration.name.split(".")[0]);
        for (const dbMigration of dbMigrations) {
            console.log(`| ${dbMigration.padEnd(80)} | ${utils_1.RESULT_TYPE_SUCCESS.padEnd(7)} |`);
        }
        for (const fsMigration of fsMigrations) {
            if (dbMigrations.includes(fsMigration)) {
                continue;
            }
            console.log(`| ${fsMigration.padEnd(80)} | ${"".padEnd(7)} |`);
        }
        (0, utils_1.gracefullyExit)(client);
    }
    catch (error) {
        console.error("[ERROR] ", error.message);
    }
});
exports.listMigrationStatuses = listMigrationStatuses;
//# sourceMappingURL=listMigrationStatues.js.map