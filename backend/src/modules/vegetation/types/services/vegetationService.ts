import { vegetationIndexMock } from "../data/vegetationIndexMock";
import { VegetationIndexSnapshot } from "../vegetationTypes";

export class VegetationService {
/**
 * Recupera todos los registros de índices de vegetación
 * disponibles en el sistema.
 */
    public static getAllSnapshots(): VegetationIndexSnapshot[] {
        return vegetationIndexMock;
    }
    /**
 * Recupera los registros de índices de vegetación
 * correspondientes a una parcela específica.
 *
 ** @param fieldId Identificador único de la parcela.
 ** @returns Lista de snapshots asociados a la parcela.
 */
    
    public static getHistoryByField(fieldId: string): VegetationIndexSnapshot[] {
        return vegetationIndexMock.filter((snapshot) => snapshot.fieldId === fieldId);
    }
}