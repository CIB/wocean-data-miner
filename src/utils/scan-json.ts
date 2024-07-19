export function scanJSON(json: any, onObject: (obj: any) => void): void {
  if (typeof json === "object" && json !== null) {
    onObject(json);
    for (const key in json) {
      if (json.hasOwnProperty(key)) {
        scanJSON(json[key], onObject);
      }
    }
  } else if (Array.isArray(json)) {
    for (const element of json) {
      scanJSON(element, onObject);
    }
  }
}
