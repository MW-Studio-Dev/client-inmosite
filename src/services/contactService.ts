import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export interface ContactPayload {
    name: string;
    email: string;
    company?: string;
    message: string;
}

export const contactService = {
    async sendMessage(payload: ContactPayload) {
        const response = await axios.post(`${API_URL}/marketing/contact/`, payload);
        return response.data;
    },
};
