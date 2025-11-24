import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where
} from 'firebase/firestore';
import { db } from '../firebase.config';
import { Venta } from '../models/venta.model';

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  private collectionName = 'ventas';

  constructor() { }

  getAll(): Observable<Venta[]> {
    const q = collection(db, this.collectionName);
    return from(getDocs(q)).pipe(
      map(snapshot => snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Venta)))
    );
  }

  getById(id: string): Observable<Venta> {
    const docRef = doc(db, this.collectionName, id);
    return from(getDoc(docRef)).pipe(
      map(snapshot => ({ id: snapshot.id, ...snapshot.data() } as Venta))
    );
  }

  create(venta: Omit<Venta, 'id'>): Observable<Venta> {
    const colRef = collection(db, this.collectionName);
    return from(addDoc(colRef, venta)).pipe(
      map(docRef => ({ ...venta, id: docRef.id } as Venta))
    );
  }

  update(id: string, venta: Partial<Venta>): Observable<void> {
    const docRef = doc(db, this.collectionName, id);
    return from(updateDoc(docRef, venta));
  }

  delete(id: string): Observable<void> {
    const docRef = doc(db, this.collectionName, id);
    return from(deleteDoc(docRef));
  }
}