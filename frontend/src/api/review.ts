import type { ReviewRequest, ReviewResponse } from '../types/review';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export async function reviewCode(request: ReviewRequest): Promise<ReviewResponse> {
    const headers = {
        'Content-Type': 'application/json',
    };
    const response = await axios.post<ReviewResponse>(`${API_BASE_URL}/api/review`, request, { headers });
    return response.data;
}