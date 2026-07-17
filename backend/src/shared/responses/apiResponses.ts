
//interfaz del contrato
export interface ApiResponse<T> {
    readonly success: boolean;
    readonly data: T | null;
    readonly message: string;
    readonly error: string | null;
    readonly timestamp: string;
}

// respuestas exitosas
export function ok<T>(data: T, message = "Data loaded successfully"): ApiResponse<T> {
    return {
        success: true,
        data,
        message,
        error: null,
        timestamp: new Date().toISOString(),
    };
};
//manejar errores de forma estandarizada
export function fail<T>(error: string): ApiResponse<T>  {
    return {
        success: false,
        data: null,
        message: "An error occurred",
        error,
        timestamp: new Date().toISOString(),
    }
};

export function createApiResponse<T> (
    success: boolean,
    data: T | null,
    message: string,
    error: string | null = null
): ApiResponse<T> {
    return {
        success,
        data,
        message,
        error,
        timestamp: new Date().toISOString(),
    }
}