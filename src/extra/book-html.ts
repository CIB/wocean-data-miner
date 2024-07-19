import type { WoceanBook } from "./find-books";

export function convertBooksToHTML(books: WoceanBook[]): string {
  let css = `
        body {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                background-color: #f5f5dc;; /* Light brown background */
        }

        .book-title {
                font-size: 2em;
                font-weight: bold;
                color: #3e2723; /* Darkish brown color */
                text-align: center;
                margin-bottom: 1em;
        }

        .book {
                width: 600px;
                border: 1px solid #8b0000; /* Darkish brown color */
                padding: 1em;
                margin-bottom: 2em;
                background-color: #fffff0;; /* Yellow-brown light color */
                border-radius: 10px;
                box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        }

        .paragraph {
                font-size: 1em;
                color: #3e2723; /* Darkish brown color */
                margin-bottom: 1em;
                text-indent: 1em;
        }`;

  let html = `<!DOCTYPE html><html><head><style>${css}</style></head><body>`;

  for (const book of books) {
    const lines = book.content.split("\n\n");
    const title = lines.shift()?.replace("##", ""); // The title is the first line

    html += `<h2 class="book-title">${title}</h2><div class="book">`;

    for (const line of lines) {
      html += `<p class="paragraph">${line}</p>`;
    }

    html += "</div>"; // Close book div
  }

  html += "</body></html>";

  return html;
}
