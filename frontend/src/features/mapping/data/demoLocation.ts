/** Desplazamiento visual hacia el área rural al este de Chinandega, cerca de -87.098, 12.640. */
// No representa linderos levantados en campo: conserva la forma y el área aproximada del demo.
const DEMO_LONGITUDE_OFFSET = 0.028;
const DEMO_LATITUDE_OFFSET = 0.014;

export function relocateDemoPosition([longitude, latitude]: number[]): number[] {
  return [longitude + DEMO_LONGITUDE_OFFSET, latitude + DEMO_LATITUDE_OFFSET];
}

export function relocateDemoRing(ring: number[][]): number[][] {
  return ring.map(relocateDemoPosition);
}

export function relocateDemoPolygon(rings: number[][][]): number[][][] {
  return rings.map(relocateDemoRing);
}
