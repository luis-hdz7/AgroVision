
//interfaz del contrato
export interface ApiResponse<T> {
    readonly success: boolean;
    readonly data: T | null;
    readonly message: string;
    readonly error: string | null;
    readonly timestamp: number;
}

// respuestas exitosas
export function ok<T>(data: T, message = "Data loaded successfully"): ApiResponse<T> {
    return {
        success: true,
        data,
        message,
        error: null,
        timestamp: Date.now(),
    };
};
//manejar errores de forma estandarizada
export function fail<T>(error: string): ApiResponse<T>  {
    return {
        success: false,
        data: null,
        message: "An error ocurred",
        error,
        timestamp: Date.now()
    }
};