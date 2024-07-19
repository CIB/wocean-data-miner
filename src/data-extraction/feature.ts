// Feature codes:
// 11: Element Rate
// 14: State Resist
// 21: Parameter
// 22: Ex-Parameter
// 23: Sp-Parameter
// 32: Atk Element
// 41: Add Skill Type
// 54: Seal Equip

import { paramsDoc } from "./common";
import type { Feature } from "./parse-enemies";
import { rpgSystem } from "./rpg-system";
import { states } from "./states";

export interface ElementRateFeature {
  type: "ElementRate";
  element: string;
  rate: number;
}

export interface StateResistFeature {
  type: "StateResist";
  state: string;
  value: number;
}

export interface StateRateFeature {
  type: "StateRate";
  state: string;
  rate: number;
}

export interface ParameterFeature {
  type: "Parameter";
  parameter: number;
  value: number;
}

export interface ExParameterFeature {
  type: "ExParameter";
  parameter: number;
  value: number;
}

export interface UnknownFeature {
  type: "Unknown";
}

export type FeatureUnion =
  | ElementRateFeature
  | StateResistFeature
  | StateRateFeature
  | ParameterFeature
  | ExParameterFeature
  | UnknownFeature;

export function parseFeature(feature: Feature): FeatureUnion {
  if (feature.code === 11) {
    return {
      type: "ElementRate",
      element: rpgSystem.elements[feature.data_id],
      rate: feature.value,
    };
  } else if (feature.code === 14) {
    return {
      type: "StateResist",
      state: states[feature.data_id].name,
      value: feature.value,
    };
  } else if (feature.code === 21) {
    return {
      type: "Parameter",
      parameter: feature.data_id,
      value: feature.value,
    };
  }

  return { type: "Unknown" };
}
