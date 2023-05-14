# **Overview**

Migrate Tool is a Node.js CLI tool for executing database migrations using the pg library as the database driver. The tool allows you to execute forward and backward migrations in a specified order based on the filename (datetime prefix). Separate migrations can be run once, and if they succeed, they will be recorded in the database in the pre-defined table.

# **Installation & configuration**

1. Install via CLI: `npm install @metaaa/pgmigrate` or `yarn add @metaaa/pgmigrator`

2. Create `migrator.config.js` inside the root of your project

3. Configure the migrator with the `migrator.config.js` file


### **Configuration**

Before using the migrator, you need to configure your database credentials. You can do this by creating a **migrator.config.js** file in the root of your project. The file should export an object with the following properties:

```js
require('dotenv').config();

module.exports = {
  config: {
    host: process.env.PGHOST,
    port: Number(process.env.PGPORT),
    database: process.env.PGDATABASE,
    user: process.env.PGUSERNAME,
    password: process.env.PGPASSWORD,
    statement_timeout: 30,
    idle_in_transaction_session_timeout: 1800,
  },
  database: {
    tableName: 'migrations',
  },
  fileSystem: {
    migrationsDir: './src/database/migrations',
    outputDir: './dist/database/migrations',
    extension: '.ts',
  },
};
```

**The  config object is a PoolConfig typed object from the pg library. The available parameters can be found in the [documentation of the pg library](https://github.com/brianc/node-postgres/blob/master/docs/pages/apis/client.mdx).**

| PROPERTY |type | description |
| -------- | --- | ----------- |
| config.**config** | PoolConfig (object) | PoolConfig from the pg library |
| config.database.**tableName** | string | name of the database table where the fact of successful execution will be stored per migration |
| config.fileSystem.**migrationsDir** | string | path to the directory where the migration files will are stored (js/ts) |
| config.fileSystem.**outputDir** | string | path to the directory where the migration files has to be created (js/ts) |
| config.fileSystem.**extension** | string | extension of the generated migrations (.js/.ts) |

---

# **Usage**

### **Commands**

`npx migrator create <name>`

- Create a migration file with the basic template. The given name will be prefixed with the current datetime in a format: `202305131530876-[name_simplified].[ext]`

`npx migrator run`

- Run all migrations which are not yet executed migrations

`npx migrator status`

- Displays the state of successfully executed and not yet executed migrations

`npx migrator rollback <count>`

- Rolls back the **last N** migrations by calling the migration file's `down` function.

---

*migrator is licensed under the MIT License. See LICENSE for more information.*

**Contributions to migrator are welcome!**
