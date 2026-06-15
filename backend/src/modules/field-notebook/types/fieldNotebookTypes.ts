//Esta carpeta contiene los tipos de datos relacionados con el field notebook.
//Su funcion es definir la estructura de los datos que se manejan en el field notebook, como las entradas, actividades, problemas observados, acciones tomadas.
export interface FieldNotebookEntry {
  id: string;
  fieldId: string;
  cropId: string;
  activityType: string;
  description: string;
  problemObserved?: string;
  actionTaken?: string;
  responsibleUser: string;
  evidence?: Array<{
    id: string;
    type: 'image' | 'video' | 'note' | 'sensor';
    source: string;
    description?: string;
    url?: string;
  }>;
  createdAt: string;
}
