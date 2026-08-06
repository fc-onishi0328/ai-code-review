export type LoginRequest = {
    email: string;
    password: string;
}

export type LoginResponse = {
    access_token: string;
    token_type: string;
}

export type RegisterRequest = {
    email: string;
    password: string;
}

export type RegisterResponse = {
    id: number;
    email: string;
}

export type LoginFormProps = {
    onSubmit: (loginRequest: LoginRequest) => void;
    loading: boolean
}

export type RegisterFormProps = {
    onSubmit: (registerRequest: RegisterRequest) => void;
    loading: boolean,
}