export function extractTehsil(hierarchy: string): string {
  return hierarchy.split("(Sub-District)")[0].trim();
}