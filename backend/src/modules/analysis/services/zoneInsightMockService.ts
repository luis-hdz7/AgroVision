import { zoneInsightMock } from "../data/zoneInsightMock";
import { ZoneInsight } from "../types/zoneInsightTypes";

export const getZoneInsightByzoneId = (zoneId: string): ZoneInsight | null => {
    const zone = zoneInsightMock.find((item) => item.zoneId === zoneId);
    return zone ?? null;
};