import { FieldActivityType } from './fieldActivityTypes';

// Esta carpeta contiene los tipos de datos relacionados con el field notebook.
// Su función es definir la estructura de los datos que se manejan en el field notebook, como las entradas, actividades, problemas observados y acciones tomadas.
export interface FieldNotebookEvidence {
  id: string;
  type: 'image' | 'video' | 'note' | 'sensor' | 'document';
  source: string;
  description?: string;
  url?: string;
  capturedAt?: string;
}

export interface FieldNotebookEntry {
  id: string;
  fieldId: string;
  zoneId: string;
  cropId: string;
  activityType: FieldActivityType;
  description: string;
  problemObserved: string;
  actionTaken: string;
  responsibleUser: string;
  evidence?: FieldNotebookEvidence[];
  createdAt: string;
}
