/** Use pattern matching to find books */

import { scanJSON } from "../utils/scan-json";
import { some } from "lodash";
import { clean } from "../data-extraction/clean";

// The pattern is as follows:
// 1. It is a JSON object, which can be in any .json file at any depth
// 2. The object contains "json_class": "RPG::CommonEvent",
// 3. The object contains a "list" property which is an array of objects
// 4. Filter out only the events with code 401
// 5. The first of these events should be quoted with \\c[2], the text between the \\c[2] is the title
// 6. The rest of the 401 events are paragraphs of the book
// 7. Convert \\c[1] to subheadings

export interface WoceanBook {
  content: string;
}

const blacklist = ["Demonic Shards", "Puzzle Pieces"];

export function scanForBooks(json: any): WoceanBook[] {
  const books: WoceanBook[] = [];

  scanJSON(json, (obj) => {
    if (
      obj.json_class === "RPG::CommonEvent" ||
      obj.json_class === "RPG::Event::Page"
    ) {
      if (obj.list) {
        const texts = obj.list
          .filter(
            (event: any) =>
              event.code === 401 && event.parameters[0]?.length > 0
          )
          .map((event: any) => event.parameters[0]);
        if (texts.length < 2 || !texts[0].startsWith("\\c[2]")) {
          return;
        }
        const book: WoceanBook = {
          content: `## ${clean(texts[0])}\n\n`,
        };

        for (let i = 1; i < texts.length; i++) {
          if (texts[i].startsWith("\\c[1]")) {
            book.content += "### " + clean(texts[i]) + "\n";
          } else {
            book.content += clean(texts[i]) + "\n\n";
          }
        }

        if (some(blacklist, (title) => texts[0].includes(title))) {
          return;
        }
        books.push(book);
      }
    }
  });

  return books;
}

/** Example of pattern:
 * 
 * 
 *   {
    "json_class": "RPG::CommonEvent",
    "trigger": 0,
    "name": "Status 1",
    "switch_id": 1,
    "list": [
      {
        "json_class": "RPG::EventCommand",
        "indent": 0,
        "code": 101,
        "parameters": [
          "",
          0,
          1,
          1
        ]
      },
      {
        "json_class": "RPG::EventCommand",
        "indent": 0,
        "code": 401,
        "parameters": [
          "\\c[2]Status Encylopedia Vol 1\\c[0]"
        ]
      },
      {
        "json_class": "RPG::EventCommand",
        "indent": 0,
        "code": 401,
        "parameters": [
          "All elements have an effect attached to them."
        ]
      },
      {
        "json_class": "RPG::EventCommand",
        "indent": 0,
        "code": 101,
        "parameters": [
          "",
          0,
          1,
          1
        ]
      },

      ...
 */
