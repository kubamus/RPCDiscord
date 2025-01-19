export function processString(template: string, variables: Record<string, string>): string {
  return template.replace(/{\w+}/g, (placeholder) => variables[placeholder] || "");
}
