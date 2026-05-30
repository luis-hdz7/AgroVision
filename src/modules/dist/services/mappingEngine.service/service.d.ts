export declare const processMappingEngine: () => {
    terrain: {
        width: number;
        height: number;
    };
    rover: {
        trajectory: {
            x: number;
            y: number;
            timestamp: number;
        }[];
    };
    plants: {
        id: string;
        species: string;
        x: number;
        y: number;
        health: string;
    }[];
    obstacles: {
        id: string;
        type: string;
        x: number;
        y: number;
        size: number;
    }[];
    status: {
        battery: number;
        state: string;
    };
    stats: {
        plantsDetected: number;
        obstaclesDetected: number;
        distanceTraveled: number;
    };
    events: {
        message: string;
        timestamp: number;
    }[];
};
//# sourceMappingURL=service.d.ts.map