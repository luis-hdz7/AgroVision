

//lecutra de telemetria
export interface TelemetryReading {
    readonly id: string;
    readonly fieldId: string;
    readonly sensorId: string;
    readonly metric: string;
    readonly value: number;
    readonly unit: string;
    readonly quality: "VALID" | "ESTIMATED" | "MISSING"
    readonly timestamp: string;
}