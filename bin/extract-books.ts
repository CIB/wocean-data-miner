import fs from "fs/promises";
import path from "path";
import { scanForBooks, type WoceanBook } from "../src/extra/find-books";
import { convertBooksToHTML } from "../src/extra/book-html";

// Get the first argument which is a directory
const args = process.argv.slice(2);
const directory = args[0];

if (!directory) {
  console.error("Please provide a directory");
  process.exit(1);
}

const files = await fs.readdir(directory);
const books: WoceanBook[] = [];
for (let file of files) {
  if (!file.endsWith(".json")) {
    continue;
  }

  const json = JSON.parse(
    await fs.readFile(path.join(directory, file), "utf-8")
  );

  books.push(...scanForBooks(json));
}

console.log(convertBooksToHTML(books));
