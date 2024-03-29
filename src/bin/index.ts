#!/usr/bin/env node

import { Command } from "commander";
import { createMigrationByName } from "../actions/createMigration.js";
import { listMigrationStatuses } from "../actions/listMigrationStatues.js";
import { runMigrations } from "../actions/runMigrations.js";
import { rollbackMigrationsByCount } from "../actions/rollbackMigrations.js";

const program = new Command();

program
  .command("run")
  .description("Run all pending migrations")
  .action(runMigrations);

program
  .command("status")
  .description("List all the migrations and diplay their statuses")
  .action(listMigrationStatuses);

program
  .command("create <name>")
  .description("Create a new migration file")
  .action(createMigrationByName);

program
  .command("rollback <count>")
  .description("Rollback n migratins. If count not provided only the last migration will be rolled back")
  .action(rollbackMigrationsByCount)

program.parse(process.argv);
