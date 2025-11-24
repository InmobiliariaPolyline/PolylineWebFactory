import { Timestamp } from 'firebase/firestore';

export interface Usuario {
  id?: string;
  nombres: string;
  apellidos: string;
  email: string;
  contraseña?: string;
  active?: boolean;
  rol?: string;
  createdAt?: Timestamp | Date;
  updatedAt?: Timestamp | Date;
}
