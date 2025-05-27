export interface PassengerDTO {
    uuid: string;
    name: string;
    lastName: string;
    email: string;
    phone: string;
    createdAt: string;
    updatedAt?: string | null;
    deletedAt?: string | null;
}
  