import fs from "fs/promises";
import path from "path";

export interface RpgSystem {
  elements: string[];
}

export const rpgSystem: RpgSystem = {} as any;

export async function parseRpgSystem(directory: string) {
  const content = await fs.readFile(
    path.join(directory, "System.json"),
    "utf-8"
  );
  Object.assign(rpgSystem, JSON.parse(content));
}
