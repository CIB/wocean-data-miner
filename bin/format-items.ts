import { items, processItem } from "../src/data-extraction/parse-items";

import { values } from "lodash";
import { processData } from "../src/process-data";

export async function formatItems(directory: string) {
  const processed = values(items).map(processItem);

  for (let item of processed) {
    if (!item.name) continue;
    console.log(`## ${item.name || "Unknown"}`);
    console.log("");
    if (item.description) {
      console.log(item.description);
      console.log("");
    }

    let damageDesc = `[${item.damageCalc}]`;
    if (item.numberOfHits > 1) {
      damageDesc = `${item.numberOfHits} x [${damageDesc}]`;
    }
    if (item.damageType !== "none") {
      damageDesc = `${damageDesc} ${item.damageType}`;
    }

    if (damageDesc !== "[0]") console.log(`${damageDesc}`);
    if (item.element !== "none") console.log(`Element: ${item.element}`);
    console.log(`Target: ${item.target}`);
    console.log(`Hit Type: ${item.hitType}`);
    console.log(`Hit%: ${item.chanceToHit}`);
    if (item.staminaGain) console.log(`Stamina: +${item.staminaGain}`);
    for (let [effect, value] of Object.entries(item.effects)) {
      console.log(`${value} ${effect}`);
    }
    console.log(`Available in: ${item.occasion}`);
    console.log("\n");
  }
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
  formatItems(directory);
}
