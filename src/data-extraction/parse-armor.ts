import type { Dictionary } from "lodash";
import type { Stats } from "./common";

interface Feature {
  json_class: string;
  code: number;
  data_id: number;
  value: number;
}

export interface Armor {
  json_class: string;
  description: string;
  name: string;
  icon_index: number;
  price: number;
  note: string;
  id: number;
  features: Feature[];
  params: number[];
  etype_id: number;
  atype_id: number;
}

export interface ProcessedArmor {
  name: string;
  description: string;
  price: number;
  iconIndex: number;
  features: Dictionary<string>;
  stats: Stats;
  equipmentType: string;
  armorType: string;
}
