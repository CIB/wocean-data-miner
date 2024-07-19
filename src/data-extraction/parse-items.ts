import type { Dictionary } from "lodash";
import path from "path";
import fs from "fs/promises";
import {
  processAvailable,
  type Effect,
  processTargets,
  processEffects,
  processDamageType,
  processElement,
  processHitType,
  parseDescription,
} from "./common";

type Item = {
  json_class: string;
  description: string;
  name: string;
  consumable: boolean;
  occasion: number;
  icon_index: number;
  price: number;
  scope: number;
  animation_id: number;
  note: string;
  speed: number;
  id: number;
  features: any[];
  effects: Effect[];
  damage: {
    json_class: string;
    type: number;
    element_id: number;
    formula: string;
    variance: number;
    critical: boolean;
  };
  success_rate: number;
  hit_type: number;
  itype_id: number;
  repeats: number;
  tp_gain: number;
};

export interface ProcessedItem {
  name: string;
  description: string;
  consumable: boolean;
  occasion: string;
  price: number;
  target: string;
  speed: number;
  effects: Dictionary<string>;
  damageType: string;
  damageCalc: string;
  element: string;
  chanceToHit: number;
  numberOfHits: number;
  hitType: string;
  staminaGain: number;
}

export const items: Dictionary<Item> = {};

export async function parseItems(basedir: string) {
  const itemFile = path.join(basedir, "Items.json");
  const itemList = JSON.parse(await fs.readFile(itemFile, "utf-8"));
  for (let item of itemList) {
    if (item && item.id) items[item.id] = item;
  }
}

export function processItem(item: Item): ProcessedItem {
  return {
    name: item.name,
    description: parseDescription(item.description),
    consumable: item.consumable,
    occasion: processAvailable(item.occasion),
    price: item.price,
    target: processTargets(item.scope),
    speed: item.speed,
    effects: processEffects(item.effects),
    damageType: processDamageType(item.damage.type),
    damageCalc: item.damage.formula,
    element: processElement(item.damage.element_id),
    chanceToHit: item.success_rate,
    numberOfHits: item.repeats,
    hitType: processHitType(item.hit_type),
    staminaGain: item.tp_gain,
  };
}
