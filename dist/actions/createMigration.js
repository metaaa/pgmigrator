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
exports.createMigrationByName = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const templates_1 = require("../templates");
const utils_1 = require("../utils");
/**
 * Creates a single migration file with the provided file name prefixed with the current datetime
 */
const createMigrationByName = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const config = (0, utils_1.getConfig)();
    console.log(`\nCreating migration...\n`);
    try {
        const dateTime = new Date().toISOString().replace(/[-T:\.Z]/g, "");
        const fileName = `${dateTime}-${name
            .toLocaleLowerCase()
            .replace(/[^a-z0-9]/g, "_")}${config.fileSystem.extension || ".ts"}`;
        const outputDir = (0, path_1.resolve)(config.fileSystem.migrationsDir);
        const filePath = (0, path_1.resolve)(outputDir, fileName);
        if (!(0, fs_1.existsSync)(outputDir)) {
            yield fs_1.promises.mkdir(outputDir);
            (0, utils_1.wrapTextWithAsterisk)(`[WARN] Couldn't create migration file in ${outputDir}. Make sure the directory exists and you have permissions to interact with.`);
        }
        yield fs_1.promises.writeFile(filePath, templates_1.migrationFileContent);
        console.log(`\n[SUCCESS] Migration file has been created at ${filePath}`);
        process.exit(0);
    }
    catch (err) {
        console.error("\n[ERROR] ", err.message);
        process.exit(0);
    }
});
exports.createMigrationByName = createMigrationByName;
//# sourceMappingURL=createMigration.js.map