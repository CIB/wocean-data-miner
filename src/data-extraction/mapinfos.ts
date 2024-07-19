import * as fs from "fs/promises";
import type { Dictionary } from "lodash";
import path from "path";

export interface MapInfo {
  json_class: "RPG::MapInfo";
  scroll_x: number;
  name: string;
  expanded: boolean;
  order: number;
  scroll_y: number;
  parent_id: number;
}

export const mapInfos: Dictionary<MapInfo> = {};

export async function parseMapInfos(basedir: string) {
  const file = path.join(basedir, "MapInfos.json");
  Object.assign(mapInfos, JSON.parse(await fs.readFile(file, "utf-8")));
}
