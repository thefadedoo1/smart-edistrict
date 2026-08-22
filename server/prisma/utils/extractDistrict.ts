export function extractDistrict(hierarchy: string): string {
  return hierarchy.split("(District)")[0].trim();
}