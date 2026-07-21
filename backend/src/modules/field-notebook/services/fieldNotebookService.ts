import { fieldNotebookMock } from "../data/fieldNotebookMock";
import { FieldNotebookEntry } from "../types/fieldNotebookTypes";

export class FieldNotebookService {
  static getAllEntries(): FieldNotebookEntry[] {
    return this.cloneEntries(fieldNotebookMock);
  }

  static getEntriesByZone(zoneId: string): FieldNotebookEntry[] {
    const normalizedZoneId = zoneId.trim().toLowerCase();
    return this.cloneEntries(fieldNotebookMock.filter(
      (entry) => entry.zoneId.trim().toLowerCase() === normalizedZoneId,
    ));
  }

  static getEntriesByField(fieldId: string): FieldNotebookEntry[] {
    const normalizedFieldId = fieldId.trim().toLowerCase();
    return this.cloneEntries(fieldNotebookMock.filter(
      (entry) => entry.fieldId.trim().toLowerCase() === normalizedFieldId,
    ));
  }

  private static cloneEntries(entries: FieldNotebookEntry[]): FieldNotebookEntry[] {
    return entries.map((entry) => ({
      ...entry,
      evidence: entry.evidence?.map((evidence) => ({ ...evidence })),
    }));
  }
}
