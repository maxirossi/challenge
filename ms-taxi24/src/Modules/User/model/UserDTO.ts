// src/Modules/User/model/UserDTO.ts
export interface UserDTO {
    uuid: string;
    name: string;
    email: string;
    lastName: string;
    user: string;
    active: boolean;
    createdAt: string;
    deletedAt?: string | null;
    modifiedAt?: string | null;
}