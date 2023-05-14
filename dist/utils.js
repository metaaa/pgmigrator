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
exports.wrapTextWithAsterisk = exports.gracefullyExit = exports.loadMigrationsFromDbForRollback = exports.loadMigrationsFromDb = exports.loadMigrationsFromFs = exports.rollbackMigration = exports.markMigrationAsRun = exports.hasMigrationRun = exports.setupIfNeeded = exports.getConfig = exports.RESULT_TYPE_FAILED = exports.RESULT_TYPE_SUCCESS = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const templates_1 = require("./templates");
exports.RESULT_TYPE_SUCCESS = "SUCCESS";
exports.RESULT_TYPE_FAILED = "FAILED";
/**
 * Checks to existence of the config file and grant type-safety usage
 */
const getConfig = () => {
    try {
        return require((0, path_1.resolve)("./migrator.config.js"));
    }
    catch (error) {
        console.log(error);
        console.error(templates_1.MISSING_CONFIG_ERROR);
        process.exit(0);
    }
};
exports.getConfig = getConfig;
/**
 * Creates the migrations table if not yet created
 */
const setupIfNeeded = (params) => __awaiter(void 0, void 0, void 0, function* () {
    yield params.client.query(`CREATE TABLE [IF NOT EXISTS] ${params.tableName} (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
  )`);
});
exports.setupIfNeeded = setupIfNeeded;
/**
 * Returns whether the given migration has already executed
 */
const hasMigrationRun = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield params.client.query(`SELECT name FROM ${params.tableName} WHERE name = $1`, [params.migrationName]);
    return result.rows.length !== 0;
});
exports.hasMigrationRun = hasMigrationRun;
/**
 * Insert the migration into the DB
 */
const markMigrationAsRun = (params) => __awaiter(void 0, void 0, void 0, function* () {
    yield params.client.query(`INSERT INTO ${params.tableName} (name) VALUES($1)`, [params.migrationName]);
});
exports.markMigrationAsRun = markMigrationAsRun;
/**
 * Removes the migration from the db
 */
const rollbackMigration = (params) => __awaiter(void 0, void 0, void 0, function* () {
    yield params.client.query(`DELETE FROM ${params.tableName} WHERE name = $1`, [
        params.migrationName,
    ]);
});
exports.rollbackMigration = rollbackMigration;
/**
 * Returns array of migrations from the Fs
 */
const loadMigrationsFromFs = (fsPath) => __awaiter(void 0, void 0, void 0, function* () {
    const files = yield fs_1.promises.readdir(fsPath);
    return Promise.all(files
        .filter((file) => [".js", ".ts"].includes((0, path_1.extname)(file)) &&
        !(0, path_1.extname)(file).includes(".map."))
        .sort()
        .map((file) => __awaiter(void 0, void 0, void 0, function* () {
        const filePath = (0, path_1.resolve)(fsPath, file);
        return { name: file, actions: require(filePath) };
    })));
});
exports.loadMigrationsFromFs = loadMigrationsFromFs;
/**
 * Returns array of successful migrations from the DB
 */
const loadMigrationsFromDb = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield params.client.query(`SELECT * FROM ${params.tableName} ORDER BY id ASC`);
    return result.rows;
});
exports.loadMigrationsFromDb = loadMigrationsFromDb;
/**
 * Returns array n last successful migrations from the DB
 */
const loadMigrationsFromDbForRollback = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield params.client.query(`SELECT * FROM ${params.tableName} ORDER BY id DESC LIMIT ${params.count}`);
    return result.rows;
});
exports.loadMigrationsFromDbForRollback = loadMigrationsFromDbForRollback;
/**
 * Release client connection and terminates process
 */
const gracefullyExit = (client) => {
    client.release();
    process.exit(0);
};
exports.gracefullyExit = gracefullyExit;
/**
 * Wraps the gicen text with asterisks
 */
const wrapTextWithAsterisk = (text) => {
    console.log("*".repeat(text.length + 4));
    console.log(`* ${text} *`);
    console.log("*".repeat(text.length + 4));
};
exports.wrapTextWithAsterisk = wrapTextWithAsterisk;
//# sourceMappingURL=utils.js.map