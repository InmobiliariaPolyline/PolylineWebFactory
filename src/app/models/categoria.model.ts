import { Timestamp } from 'firebase/firestore';

export interface Categoria {
  id: string;
  activo: boolean;
  createdAt: Date | Timestamp;
  descripcion: string;
  nombre: string;
  slug: string;
}