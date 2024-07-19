/** Clean up a string that was extracted from RPGMaker */
export function clean(str: string): string {
  return str.replace(/\\[cC]\[\d+\]/g, "").replace(/\\[nN]\[\d+\]/g, "\n\n");
}
