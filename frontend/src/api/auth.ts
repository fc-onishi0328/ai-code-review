import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "@/types/auth";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export async function login(request: LoginRequest): Promise<LoginResponse> {
    const headers = {
        'Content-Type': 'application/json',
    };
    const response = await axios.post<LoginResponse>(`${API_BASE_URL}/api/auth/login`, request, { headers })
    return response.data
}

export async function register(request: RegisterRequest): Promise<RegisterResponse> {
    const headers = {
        'Content-Type': 'application/json',
    };
    const response = await axios.post<RegisterResponse>(`${API_BASE_URL}/api/auth/register`, request, { headers })
    return response.data
}