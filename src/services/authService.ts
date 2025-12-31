import axiosInstance from '@/lib/api';

interface ForgotPasswordResponse {
    message: string;
    success: boolean;
}

interface ResetPasswordRequest {
    token: string;
    new_password: string;
    new_password_confirm: string;
}

interface ResetPasswordResponse {
    message: string;
    success: boolean;
}

interface ChangePasswordRequest {
    current_password: string;
    new_password: string;
    new_password_confirm: string;
}

interface ChangePasswordResponse {
    message: string;
    success: boolean;
}

interface APIResponse {
    success: boolean;
    message: string;
    data: any;
    meta?: any;
    timestamp?: string;
    request_id?: string;
}

const AUTH_BASE = '/auth';

export const authService = {
    /**
     * Solicita el restablecimiento de contraseña (Paso 1)
     * @param email Email del usuario que solicita el restablecimiento
     */
    async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
        const response = await axiosInstance.post<APIResponse>(
            `${AUTH_BASE}/forgot-password/`,
            { email }
        );

        return {
            success: response.data.success,
            message: response.data.message
        };
    },

    /**
     * Confirma el restablecimiento de contraseña con token (Paso 2)
     * @param data Token y nuevas contraseñas
     */
    async resetPassword(data: ResetPasswordRequest): Promise<ResetPasswordResponse> {
        const response = await axiosInstance.post<APIResponse>(
            `${AUTH_BASE}/reset-password/`,
            data
        );

        return {
            success: response.data.success,
            message: response.data.message
        };
    },

    /**
     * Cambia la contraseña de un usuario autenticado
     * @param data Contraseña actual y nueva contraseña
     */
    async changePassword(data: ChangePasswordRequest): Promise<ChangePasswordResponse> {
        const response = await axiosInstance.post<APIResponse>(
            `${AUTH_BASE}/profile/change-password/`,
            data
        );

        return {
            success: response.data.success,
            message: response.data.message
        };
    },
};
