
//interfaz del contrato
export interface ApiResponse<T> {
    success: boolean;
    data: T | null;
    message?: string;
    error?: string;
    timestamp: string;
}

// respuestas exitosas
export const ok = <T>(data: T, message = "Data loaded successfully"): ApiResponse<T> => {
    return {
        success: true,
        data,
        message,
        timestamp: new Date().toISOString()
    };
};
//manejar errores de forma estandarizada
export const fail = (error: string): ApiResponse<null> => {
    return {
        success: false,
        data: null,
        error,
        timestamp: new Date().toISOString()
    };
};