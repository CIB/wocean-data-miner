/**
 *             {
              "json_class": "RPG::EventCommand",
              "indent": 0,
              "code": 201,
              "parameters": [
                0,
                90,
                14,
                17,
                0,
                0
              ]
            },
 */

import { mapInfos } from "../data-extraction/mapinfos";
import { scanJSON } from "../utils/scan-json";

export function findConnectionsInMap(json: any): string[] {
  let connections: string[] = [];

  scanJSON(json, (obj) => {
    if (obj.json_class === "RPG::EventCommand") {
      if (obj.code === 201) {
        const targetMap = mapInfos[obj.parameters[1]];
        if (targetMap) {
          connections.push(targetMap.name);
        }
      }
    }
  });
  return connections;
}
