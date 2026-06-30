import { vegetationIndexMock } from "../data/vegetationIndexMock";
import { VegetationIndexSnapshot } from "../vegetationTypes";

export class VegetationService {
    /**
     * Recupera la totalidad de los registros historicos de NDVI capturados en el sistema
     */
    public static getAllSnapshots(): VegetationIndexSnapshot[] {
        return vegetationIndexMock;
    }
    /**Filtra y retorna el histórico cronológico de vigor vegetal asignado a una parcela específica.
     * Útil para renderizar gráficas de evolución de salud satelital por campo.
     * *@param fieldId Identificador único de la parcela (ej. 'field-001')
     */
    public static getHistoryByField(fieldId: string): VegetationIndexSnapshot[] {
        return vegetationIndexMock.filter((snapshot) => snapshot.fieldId === fieldId);
    }
}