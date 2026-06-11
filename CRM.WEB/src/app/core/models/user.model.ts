export interface UserDto {
  id: string;
  email: string;
  userName: string;
  nom: string;
  prenom: string;
  isActive: boolean;
  roles: string[];
  selectedRole?: string;
}

export interface UpdateUserRoleRequest {
  role: string;
}

export interface UserStatusRequest {
  action: string;
}
