# WORK IN PROGRESS

Migrate Tool
Overview

Migrate Tool is a Node.js command-line interface (CLI) tool for executing database migrations using the pg library as the database driver. The tool allows you to execute forward-only migrations in a specified order based on the filename (a-z). Separate migrations can be run once, and if they succeed, they will be recorded in the database in the migrations table.
Installation

You can install Migrate Tool via npm:

npm install migrate-tool

Usage
Configuration

Before using Migrate Tool, you need to configure your database credentials. You can do this by creating a migration.config.ts file in the root of your project. The file should export an object with the following properties:

typescript

export const config = {
  database: 'my_database',
  host: 'localhost',
  port: 5432,
  user: 'my_user',
  password: 'my_password'
};

Running Migrations

To run migrations, you can use the npx command:

npx migrate-tool migrate

This will execute any pending migrations in alphabetical order based on their filenames.
Creating Migrations

To create a new migration file, you can use the npx command:

css

npx migrate-tool create [migration_name]

This will create a new migration file in the migrations directory of your project.
License

Migrate Tool is licensed under the MIT License. See LICENSE for more information.
Contributing

Contributions to Migrate Tool are welcome! Please read CONTRIBUTING.md for more information on how to contribute.