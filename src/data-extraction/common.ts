import type { Dictionary } from "lodash";
import { rpgSystem } from "./rpg-system";
import { states } from "./states";
import { clean } from "./clean";

const damageTypes = [
  "none",
  "Health",
  "Mana",
  "Health Recovery",
  "Mana Recovery",
  "Health Drain",
  "Mana Drain",
];

export type HitType = "Certain" | "Physical" | "Magical";
const hitTypes = ["certain", "physical", "magical"];

export type Occasion = "Battle / Menu" | "Battle" | "Menu" | "Never";
const occasions: Occasion[] = ["Battle / Menu", "Battle", "Menu", "Never"];

export interface Effect {
  code: number;
  data_id: number;
  value1: number;
  value2: number;
}

export interface AddState {
  code: 21;
  data_id: number;
  value1: number;
  value2: number;
}

export interface RemoveState {
  code: 22;
  data_id: number;
  value1: number;
  value2: number;
}

export type Scope =
  | "none"
  | "One Enemy"
  | "All Enemies"
  | "One Random Enemy"
  | "2 Random Enemies"
  | "3 Random Enemies"
  | "4 Random Enemies"
  | "One Ally"
  | "All Allies"
  | "One Dead Ally"
  | "All Dead Allies"
  | "The User";

const scopes = [
  "none",
  "One Enemy",
  "All Enemies",
  "One Random Enemy",
  "2 Random Enemies",
  "3 Random Enemies",
  "4 Random Enemies",
  "One Ally",
  "All Allies",
  "One Dead Ally",
  "All Dead Allies",
  "The User",
];

export function processDamageType(damageType: number) {
  return damageTypes[damageType];
}

export function processElement(element: number) {
  return rpgSystem.elements[element];
}

export function processEffects(effectsIn: Effect[]) {
  const effects: Dictionary<string> = {};
  for (let effect of effectsIn) {
    switch (effect.code) {
      case 21: {
        const name = states[effect.data_id]?.name || "Unknown state";
        effects[name] = `+${effect.value1 * 100}%`;
        break;
      }
      case 22: {
        const name = states[effect.data_id]?.name || "Unknown state";
        effects[name] = `-${effect.value1 * 100}%`;
        break;
      }
    }
  }
  return effects;
}

export function processAvailable(occasion: number) {
  return occasions[occasion] as Occasion;
}

export function processHitType(hitType: number) {
  return hitTypes[hitType] as HitType;
}

export function processTargets(scope: number) {
  return scopes[scope] as Scope;
}

export function parseDescription(description: string) {
  return clean(description.replace("\r\n", "\n").trim());
}

export interface Stats {
  HP: number;
  Mana: Number;
  Strength: Number;
  Defense: Number;
  Magic: Number;
  Spirit: number;
  Dexterity: number;
  Luck: number;
}

export function paramsToStats(params: number[]): Stats {
  if (params.length !== 8) {
    return {
      HP: 0,
      Mana: 0,
      Strength: 0,
      Defense: 0,
      Magic: 0,
      Spirit: 0,
      Dexterity: 0,
      Luck: 0,
    };
  }
  return {
    HP: Math.round(params[0]),
    Mana: Math.round(params[1]),
    Strength: Math.round(params[2]),
    Defense: Math.round(params[3]),
    Magic: Math.round(params[4]),
    Spirit: Math.round(params[5]),
    Dexterity: Math.round(params[6]),
    Luck: Math.round(params[7]),
  };
}

export type Param =
  | "Health"
  | "Mana"
  | "Strength"
  | "Defense"
  | "Magic"
  | "Spirit"
  | "Dexterity"
  | "Luck";

export const paramsDoc: Param[] = [
  "Health",
  "Mana",
  "Strength",
  "Defense",
  "Magic",
  "Spirit",
  "Dexterity",
  "Luck",
];

export type ExParam =
  | "Hit Rate"
  | "Evasion Rate"
  | "Critical Rate"
  | "Critical Evasion Rate"
  | "Magic Evasion Rate"
  | "Magic Reflection Rate"
  | "Counter Attack Rate"
  | "Health Regeneration Rate"
  | "Mana Regeneration Rate"
  | "Stamina Regeneration Rate";
export const exParamsDoc: ExParam[] = [
  "Hit Rate",
  "Evasion Rate",
  "Critical Rate",
  "Critical Evasion Rate",
  "Magic Evasion Rate",
  "Magic Reflection Rate",
  "Counter Attack Rate",
  "Health Regeneration Rate",
  "Mana Regeneration Rate",
  "Stamina Regeneration Rate",
];

export type SpParam =
  | "Target Rate"
  | "Guard Rate"
  | "Recovery Rate"
  | "Pharmacology"
  | "MP Cost Rate"
  | "TP Charge Rate"
  | "Physical Damage Rate"
  | "Magical Damage Rate"
  | "Floor Damage Rate"
  | "Experience Rate";

export const spParamsDoc: SpParam[] = [
  "Target Rate",
  "Guard Rate",
  "Recovery Rate",
  "Pharmacology",
  "MP Cost Rate",
  "TP Charge Rate",
  "Physical Damage Rate",
  "Magical Damage Rate",
  "Floor Damage Rate",
  "Experience Rate",
];
