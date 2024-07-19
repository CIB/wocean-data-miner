/**
 *       {
        "json_class": "RPG::EventCommand",
        "indent": 1,
        "code": 301,
        "parameters": [
          1,
          262,
          true,
          true
        ]
      },
 */

import { scanJSON } from "../utils/scan-json";
import fs from "fs/promises";
import path from "path";

/** Find the files that contain an encounter */
export function findEncounters(json: any, id: number): boolean {
  let result = false;
  scanJSON(json, (obj) => {
    if (
      obj.code === 301 &&
      obj.parameters?.length >= 2 &&
      obj.parameters[1] === id
    ) {
      result = true;
    }
  });

  return result;
}

// Get the first argument which is a directory
const args = process.argv.slice(2);
const directory = args[0];

if (!directory) {
  console.error("Please provide a directory");
  process.exit(1);
}

const codes: [number, string][] = [
  // Replace these with the encounters you want to find on the map
  [394, "Demon Door I"],
  [395, "Demon Door I"],
  [396, "Demon Door III"],
  [397, "Demon Door IV"],
  [398, "Demon Door V"],
  [399, "Demon Door VI"],
  [400, "Demon Door VII"],
  [971, "Demon Door VIII"],
  [999, "Demon Door XV"],
];

const files = await fs.readdir(directory);
const results: string[] = [];
for (let file of files) {
  if (!file.endsWith(".json")) {
    continue;
  }

  const json = JSON.parse(
    await fs.readFile(path.join(directory, file), "utf-8")
  );

  for (let [code, name] of codes) {
    if (findEncounters(json, code)) {
      results.push(`${file}: ${name}`);
    }
  }
}

console.log(results.join("\n"));
