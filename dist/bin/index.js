#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const createMigration_1 = require("../actions/createMigration");
const listMigrationStatues_1 = require("../actions/listMigrationStatues");
const runMigrations_1 = require("../actions/runMigrations");
const rollbackMigrations_1 = require("../actions/rollbackMigrations");
const program = new commander_1.Command();
program
    .command("run")
    .description("Run all pending migrations")
    .action(runMigrations_1.runMigrations);
program
    .command("status")
    .description("List all the migrations and diplay their statuses")
    .action(listMigrationStatues_1.listMigrationStatuses);
program
    .command("create <name>")
    .description("Create a new migration file")
    .action(createMigration_1.createMigrationByName);
program
    .command("rollback <count>")
    .description("Rollback n migratins. If count not provided only the last migration will be rolled back")
    .action(rollbackMigrations_1.rollbackMigrationsByCount);
program.parse(process.argv);
//# sourceMappingURL=index.js.map