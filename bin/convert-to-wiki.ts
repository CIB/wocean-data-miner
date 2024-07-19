import { enemies, processEnemy } from "../src/data-extraction/parse-enemies";
import { states, processState } from "../src/data-extraction/states";
import { values } from "lodash";
import lua from "lua-json";
import { processData } from "../src/process-data";
import { writeFile } from "fs/promises";

export function enemiesToLua() {
  const processed = values(enemies).map(processEnemy);
  return lua.format(processed);
}

export function statesToLua() {
  const processed = values(states).map(processState);
  console.log(lua.format(processed));
}

if (import.meta.main) {
  // Get the first argument which is a directory
  const args = process.argv.slice(2);
  const directory = args[0];

  if (!directory) {
    console.error("Please provide a directory");
    process.exit(1);
  }
  await processData(directory);
  await writeFile("./wiki-output/enemies.lua", enemiesToLua());
  await writeFile("./wiki-output/states.lua", enemiesToLua());
}
