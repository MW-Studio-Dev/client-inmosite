import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const marketingService = {
    async joinWhitelist(email: string, name?: string, metadata?: any) {
        const response = await axios.post(`${API_URL}/marketing/whitelist/`, {
            email,
            name,
            metadata,
        });
        return response.data;
    },
};
