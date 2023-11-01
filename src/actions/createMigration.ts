import { existsSync, promises } from "fs";
import { resolve } from "path";
import { migrationFileContent } from "../templates.js";
import { getConfig, wrapTextWithAsterisk } from "../utils.js";

/**
 * Creates a single migration file with the provided file name prefixed with the current datetime
 */
export const createMigrationByName = async (name: string) => {
  const config = await getConfig();
  console.log(`\nCreating migration...\n`);

  try {
    const dateTime = new Date().toISOString().replace(/[-T:\.Z]/g, "");
    const fileName = `${dateTime}-${name
      .toLocaleLowerCase()
      .replace(/[^a-z0-9]/g, "_")}${config.fileSystem.extension || ".ts"}`;
    const outputDir = resolve(config.fileSystem.outputDir);
    const filePath = resolve(outputDir, fileName);

    if (!existsSync(outputDir)) {
      wrapTextWithAsterisk(
        `[WARN] Couldn't create migration file in ${outputDir}. Make sure the directory exists and you have permissions to interact with.`
      );
    }

    await promises.writeFile(filePath, migrationFileContent);
    console.log(`\n[SUCCESS] Migration file has been created at ${filePath}`);
  } catch (err: any) {
    console.error("\n[ERROR] ", err.message);
  } finally {
    process.exit(0);
  }
};
