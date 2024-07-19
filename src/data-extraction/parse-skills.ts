import type { Dictionary } from "lodash";
import path from "path";
import fs from "fs/promises";
import { clean } from "./clean";
import {
  processDamageType,
  type Effect,
  type HitType,
  type Occasion,
  type Scope,
  processElement,
  processEffects,
  processAvailable,
  processHitType,
  processTargets,
  parseDescription,
} from "./common";

export interface Skill {
  id: number;
  animation_id: number;
  damage: {
    critical: boolean;
    element_id: number;
    formula: string;
    type: number;
    variance: number;
  };
  description: string;
  effects: Effect[];
  hit_type: number;
  icon_index: number;
  message1: string;
  message2: string;
  mp_cost: number;
  name: string;
  note: string;
  occasion: number;
  repeats: number;
  required_wtype_id1: number;
  required_wtype_id2: number;
  scope: number;
  speed: number;
  stype_id: number;
  success_rate: number;
  tp_cost: number;
  tp_gain: number;
}

export interface ProcessedSkill {
  name: string;
  description: string;
  damageType: string;
  damageCalc: string;
  element: string;
  effects: Dictionary<string>;
  manaCost: number;
  apCost: number;
  available: Occasion;
  staminaCost: number;
  staminaGain: number;
  chanceToHit: number;
  numberOfHits: number;
  hitType: HitType;
  target: Scope;
}

export function processSkill(skill: Skill): ProcessedSkill {
  return {
    name: skill.name,
    description: parseDescription(skill.description),
    damageType: processDamageType(skill.damage.type),
    damageCalc: skill.damage.formula,
    element: processElement(skill.damage.element_id),
    effects: processEffects(skill.effects),
    manaCost: skill.mp_cost,
    apCost: processAp(skill),
    available: processAvailable(skill.occasion),
    staminaCost: skill.tp_cost,
    staminaGain: skill.tp_gain,
    chanceToHit: skill.success_rate,
    numberOfHits: skill.repeats,
    hitType: processHitType(skill.hit_type),
    target: processTargets(skill.scope),
  };
}
export function processAp(skill: Skill) {
  // <learn cost: 200 jp>
  const match = skill.note.match(/<learn cost: (\d+) jp>/);
  return match ? +match[1] : 0;
}

export const skills: Dictionary<Skill> = {};

export async function parseSkills(basedir: string) {
  const skillFile = path.join(basedir, "Skills.json");
  const skillList = JSON.parse(await fs.readFile(skillFile, "utf-8"));
  for (let skill of skillList) {
    if (skill && skill.id) skills[skill.id] = skill;
  }
}
