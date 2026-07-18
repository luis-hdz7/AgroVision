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
    public static getRecommendationsByZone(zoneId: string): Recommendation[] {
        return this.getAllRecommendations().filter(recommendation => recommendation.zoneId === zoneId);
    }
    public static getHighPriorityRecommendations(): Recommendation[] {
        return this.getAllRecommendations().filter(recommendation => recommendation.priority === "HIGH" || recommendation.priority === "URGENT");
    }
}