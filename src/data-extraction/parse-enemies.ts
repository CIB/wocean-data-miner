import { round, type Dictionary } from "lodash";
import path from "path";
import fs from "fs/promises";
import { items } from "./parse-items";
import { parseFeature, type FeatureUnion } from "./feature";
import { skills, type Skill } from "./parse-skills";
import { paramsToStats, type Stats } from "./common";

export interface ProcessedEnemy {
  id: number;
  name: string;
  dropItems: { name: string; percentage: string }[];
  stats: Stats;
  resistances: Dictionary<number>;
  stateResistances: Dictionary<number>;
  skills: Dictionary<string>;
}

export interface Enemy {
  json_class: string;
  name: string;
  gold: number;
  battler_hue: number;
  exp: number;
  battler_name: string;
  actions: Action[];
  note: string;
  id: number;
  features: Feature[];
  params: number[];
  drop_items: DropItem[];
  icon_index: number;
  description: string;
}

// Params:
// [hp, mp, atk, def, mat, mdef, agi, luk]

export function processItems(dropItems: DropItem[]) {
  return dropItems.map((item) => {
    const name = items[item.data_id]?.name;
    return {
      name: name || "Unknown Item",
      percentage: `${round((1 / item.denominator) * 100, 2)}%`,
    };
  });
}

export function processSkills(actions: Action[]): Skill[] {
  return actions.map((action) => {
    return skills[action.skill_id];
  });
}

export function processResistances(features: FeatureUnion[]) {
  let resistances: Dictionary<number> = {};
  const resistanceItems: { element: string; rate: number }[] = [];
  for (let feature of features) {
    if (feature?.type === "ElementRate") {
      resistanceItems.push({ element: feature.element, rate: feature.rate });
    }
  }

  // Collect elements and combine resistance items
  const elements = new Set<string>(resistanceItems.map((item) => item.element));
  for (let element of elements) {
    const rate = resistanceItems
      .filter((item) => item.element === element)
      .reduce((acc, item) => acc * item.rate, 1);

    resistances[element] = rate;
  }

  return resistances;
}

export function processStateResistances(
  features: FeatureUnion[]
): Dictionary<number> {
  const resistances: Dictionary<number> = {};
  for (let feature of features) {
    if (feature?.type === "StateResist") {
      resistances[feature.state] = feature.value;
    }
  }
  return resistances;
}

interface Action {
  json_class: string;
  condition_type: number;
  rating: number;
  skill_id: number;
  condition_param2: number;
  condition_param1: number;
}

export interface Feature {
  json_class: string;
  code: number;
  data_id: number;
  value: number;
}

interface DropItem {
  json_class: string;
  denominator: number;
  kind: number;
  data_id: number;
}

export function processParams(enemy: Enemy, features: FeatureUnion[]): Stats {
  const params = [...enemy.params];
  for (let feature of features) {
    if (feature?.type === "Parameter") {
      params[feature.parameter] *= feature.value;
    }
  }

  return paramsToStats(params);
}

export function processEnemy(enemy: Enemy): ProcessedEnemy {
  const features: FeatureUnion[] = [];
  for (let feature of enemy.features) {
    const parsedFeature = parseFeature(feature);
    if (parsedFeature) features.push(parsedFeature);
  }

  const skills = processSkills(enemy.actions).map((skill) => skill.name);
  // Count the skills in a dictionary
  const skillCount: { [key: string]: number } = {};
  for (let skill of skills) {
    if (skillCount[skill]) {
      skillCount[skill]++;
    } else {
      skillCount[skill] = 1;
    }
  }

  // Now normalize the counts to add up to 1
  const totalCount = Object.values(skillCount).reduce((a, b) => a + b, 0);
  for (let skill in skillCount) {
    skillCount[skill] /= totalCount;
  }
  const skillPercentages: Dictionary<string> = {};
  for (let [skill, percentage] of Object.entries(skillCount)) {
    skillPercentages[skill] = `${(percentage * 100).toFixed(0)}%`;
  }
  const resistances = processResistances(features);
  return {
    id: enemy.id,
    name: enemy.name,
    dropItems: processItems(enemy.drop_items),
    stats: processParams(enemy, features),
    resistances,
    skills: skillPercentages,
    stateResistances: processStateResistances(features),
  };
}

export const enemies: Dictionary<Enemy> = {};

export async function parseEnemies(basedir: string) {
  const enemyFile = path.join(basedir, "Enemies.json");
  const enemyList = JSON.parse(await fs.readFile(enemyFile, "utf-8"));
  for (let enemy of enemyList) {
    if (enemy && enemy.id) enemies[enemy.id] = enemy;
  }
}
