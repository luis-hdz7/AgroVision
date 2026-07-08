import { zoneInsightMock } from "../../analysis/data/zoneInsightMock";
import { cropProfilesMock } from "../../crops/data/cropProfileMock";

import { generateAlerts } from "../../alerts/services/alertGenerationService";
import { generateRecommendations } from "../services/recommendationGenerationService";

export const recommendationsMock =zoneInsightMock.flatMap(insight => {
        const alerts =generateAlerts(insight);
        const cropProfile =cropProfilesMock.find(profile => profile.cropType === insight.cropType)
    ?? cropProfilesMock.find(
        profile => profile.cropType === "GENERAL"
    );
        return generateRecommendations(
            insight,
            alerts,
            cropProfile
        );
    });

/*
    * Ediciones de este archivo
    @luis-hdz7 el 01/7/2026 (creación y primera edición)
*/