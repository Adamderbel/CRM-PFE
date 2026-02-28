export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  userName: string;
  nom: string;
  prenom: string;
  password: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  expiration: string;
  user: AuthUser;
}

export interface AuthUser {
  id: string;
  email: string;
  userName: string;
  nom: string;
  prenom: string;
  roles: string[];
}
