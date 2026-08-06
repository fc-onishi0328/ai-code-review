import type { ReviewHistoryItem } from '../types/history';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export async function getHistories(token: string): Promise<ReviewHistoryItem[]> {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    };
    const response = await axios.get<ReviewHistoryItem[]>(`${API_BASE_URL}/api/history`, {headers});
    return response.data;
}