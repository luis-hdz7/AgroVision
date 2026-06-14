import {
  TerrainDimensions,
  InspectionProgress
} from "../types/mappingTypes";

class InspectionProgressService {
  private readonly SCAN_AREA_PER_POINT = 25;

  calculate(
    visitedPoints: number,
    terrain: TerrainDimensions
  ): InspectionProgress {
    const totalArea =
      terrain.width * terrain.height;

    const inspectedArea =
      visitedPoints * this.SCAN_AREA_PER_POINT;

    const percentage =
      totalArea === 0
        ? 0
        : Math.min(
            (inspectedArea / totalArea) * 100,
            100
          );

    return {
      percentage,
      inspectedArea,
      totalArea
    };
  }
}

export default new InspectionProgressService();