// Prepare for other tasks by parsing all data into memory

import { parseEnemies } from "./data-extraction/parse-enemies";
import { parseItems } from "./data-extraction/parse-items";
import { parseSkills } from "./data-extraction/parse-skills";
import { parseRpgSystem } from "./data-extraction/rpg-system";
import { parseStates } from "./data-extraction/states";

export async function processData(directory: string) {
  await parseRpgSystem(directory);
  await parseItems(directory);
  await parseSkills(directory);
  await parseEnemies(directory);
  await parseStates(directory);
}
