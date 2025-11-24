export interface Direccion {
  pais: string;
  ciudad: string;
  distrito: string;
  linea: string;
}

import { Timestamp } from 'firebase/firestore';

export interface Cliente {
   id?: string;
   apellidos: string;
   nombres: string;
   empresa: string;
   documentoIdentidad: string;
   email: string;
   telefono: string;
   createdAt?: Date | string | Timestamp;
   direccion: Direccion;
}