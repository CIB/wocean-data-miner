import { enemies, processEnemy } from "../src/data-extraction/parse-enemies";
import { states, processState } from "../src/data-extraction/states";
import { items, processItem } from "../src/data-extraction/parse-items";
import { values } from "lodash";
import lua from "lua-json";
import { processData } from "../src/process-data";
import { writeFile } from "fs/promises";

export function formatLua(data: any) {
  const escapedData = JSON.parse(
    JSON.stringify(data).replaceAll("\\n", "\\\\n")
  );
  return lua.format(escapedData);
}

export function enemiesToLua() {
  const processed = values(enemies).map(processEnemy);
  return formatLua(processed);
}

export function statesToLua() {
  const processed = values(states).map(processState);
  return formatLua(processed);
}

export function itemsToLua() {
  const processed = values(items).map(processItem);
  return formatLua(processed);
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
  await writeFile("./wiki-output/items.lua", itemsToLua());
}
