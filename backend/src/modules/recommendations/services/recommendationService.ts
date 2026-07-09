import { recommendationsMock } from "../data/recommendationsMock";
import { Recommendation } from "../types/recommendationTypes";
/*
 * Servicio encargado de recuperar las recomendaciones agrícolas.
 * Actualmente consume datos simulados desde recommendationsMock.
 * En futuras versiones podrá obtener información desde una base de datos
 * o un motor de recomendaciones sin modificar el controlador.
 */

export class RecommendationService {
    /**
     * Recupera todas las recomendaciones disponibles.
     */
    public static getAllRecommendations(): Recommendation[] {
        return recommendationsMock;
    }
}