// src/modules/mapping/services/mappingEngine.service.ts
//devolvemos los datos simulados del rover (testing)
export const processMappingEngine = () => {
    return {
        terrain: {
            width: 100,
            height: 100
        },
        rover: {
            trajectory: [
                { x: 0, y: 0, timestamp: 0 },
                { x: 1, y: 2, timestamp: 1 },
                { x: 2, y: 4, timestamp: 2 }
            ]
        },
        plants: [
            { id: '1', species: 'Alien Flora A', x: 10, y: 15, health: 'Good' }
        ],
        obstacles: [
            { id: '1', type: 'Crater', x: 5, y: 5, size: 3 }
        ],
        status: {
            battery: 85,
            state: 'Exploring'
        },
        stats: {
            plantsDetected: 1,
            obstaclesDetected: 1,
            distanceTraveled: 5.66
        },
        events: [
            { message: 'Simulation started successfully.', timestamp: Date.now() }
        ]
    };
};
//# sourceMappingURL=service.js.map