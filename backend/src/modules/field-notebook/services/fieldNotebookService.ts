import { fieldNotebookMock } from "../data/fieldNotebookMock";
import { FieldNotebookEntry } from "../types/fieldNotebookTypes";

export class FieldNotebookService {
  static getAllEntries(): FieldNotebookEntry[] {
    return fieldNotebookMock;
  }

  static getEntriesByZone(zoneId: string): FieldNotebookEntry[] {
    return fieldNotebookMock.filter((entry) => entry.zoneId === zoneId);
  }

  static getEntriesByField(fieldId: string): FieldNotebookEntry[] {
    return fieldNotebookMock.filter((entry) => entry.fieldId === fieldId);
  }
}
