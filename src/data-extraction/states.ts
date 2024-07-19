import type { Dictionary } from "lodash";
import path from "path";
import fs from "fs/promises";
import type { Feature } from "./parse-enemies";
import { parseFeature, type FeatureUnion } from "./feature";

export interface ProcessedState {
  name: string;
  stateAddedMessage: string;
  stateRemovedMessage: string;
  priority: number;
  restriction: number;
  features: FeatureUnion[];
  autoRemovalTiming: number;
  minTurns: number;
  maxTurns: number;
  chanceByDamage: number;
  stepsToRemove: number;
  releaseByDamage: boolean;
  removeByWalking: boolean;
  removeAtBattleEnd: boolean;
  removeByDamage: boolean;
  removeByRestriction: boolean;
  isPermastate: boolean;
  slipDamage?: string;
}

export interface State {
  json_class: string;
  message2: string;
  name: string;
  priority: number;
  icon_index: number;
  message1: string;
  message4: string;
  restriction: number;
  release_by_damage: boolean;
  message3: string;
  note: string;
  id: number;
  features: Feature[];
  auto_removal_timing: number;
  min_turns: number;
  max_turns: number;
  chance_by_damage: number;
  steps_to_remove: number;
  remove_by_walking: boolean;
  remove_at_battle_end: boolean;
  remove_by_damage: boolean;
  remove_by_restriction: boolean;
}

function processSlipDamage(state: State) {
  // Slip damage will be encoded in note like this:
  // <SLIP_HP_START>
  // (a.mat*3.2)
  // <SLIP_HP_END>

  const slipDamageStart = "<SLIP_HP_START>";
  const slipDamageEnd = "<SLIP_HP_END>";
  const escapedSlipDamageStart = escapeRegExp(slipDamageStart);
  const escapedSlipDamageEnd = escapeRegExp(slipDamageEnd);
  const slipDamage = state.note.match(
    new RegExp(
      `${escapedSlipDamageStart}\r\n(.*?)\r\n${escapedSlipDamageEnd}`,
      "s"
    )
  );

  if (slipDamage) {
    return slipDamage[1]
      .replace(".mat", ".Magic")
      .replace(".atk", ".Attack")
      .replace(".mdef", ".Spirit")
      .replace(".def", ".Defense")
      .replace(".agi", ".Dexterity")
      .replace(".luk", ".Luck")
      .replace("\r\n", " ");
  }
}

function escapeRegExp(text: string) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

export const states: Dictionary<State> = {};

export async function parseStates(basedir: string) {
  const stateFile = path.join(basedir, "States.json");
  const stateList = JSON.parse(await fs.readFile(stateFile, "utf-8"));
  for (let state of stateList) {
    if (state && state.id) states[state.id] = state;
  }
}

export function processState(state: State): ProcessedState {
  return {
    name: state.name,
    stateAddedMessage: state.message1,
    stateRemovedMessage: state.message2,
    priority: state.priority,
    restriction: state.restriction,
    features: state.features.map((feature) => parseFeature(feature)),
    autoRemovalTiming: state.auto_removal_timing,
    minTurns: state.min_turns,
    maxTurns: state.max_turns,
    chanceByDamage: state.chance_by_damage,
    stepsToRemove: state.steps_to_remove,
    releaseByDamage: state.release_by_damage,
    removeByWalking: state.remove_by_walking,
    removeAtBattleEnd: state.remove_at_battle_end,
    removeByDamage: state.remove_by_damage,
    removeByRestriction: state.remove_by_restriction,
    isPermastate: state.note.includes("<permastate>"),
    slipDamage: processSlipDamage(state),
  };
}
