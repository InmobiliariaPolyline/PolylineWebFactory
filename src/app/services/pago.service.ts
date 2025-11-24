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
  deleteDoc
} from 'firebase/firestore';
import { serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.config';
import { Pago } from '../models/pago.model';

@Injectable({
  providedIn: 'root'
})
export class PagoService {
  private collectionName = 'pagos';

  constructor() { }

  getAll(): Observable<Pago[]> {
    const q = collection(db, this.collectionName);
    return from(getDocs(q)).pipe(
      map(snapshot => snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Pago)))
    );
  }

  getById(id: string): Observable<Pago> {
    const docRef = doc(db, this.collectionName, id);
    return from(getDoc(docRef)).pipe(
      map(snapshot => ({ id: snapshot.id, ...snapshot.data() } as Pago))
    );
  }

  create(pago: Omit<Pago, 'id' | 'createdAt' | 'updatedAt'>): Observable<Pago> {
    console.log('Creando pago:', pago);
    const pagoConTimestamps = {
      ...pago,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    console.log('Pago con timestamps:', pagoConTimestamps);
    const colRef = collection(db, this.collectionName);
    return from(addDoc(colRef, pagoConTimestamps)).pipe(
      map(docRef => {
        console.log('Pago creado con ID:', docRef.id);
        return { ...pago, id: docRef.id, createdAt: new Date(), updatedAt: new Date() } as Pago;
      })
    );
  }

  update(id: string, pago: Partial<Pago>): Observable<void> {
    const docRef = doc(db, this.collectionName, id);
    return from(updateDoc(docRef, pago));
  }

  delete(id: string): Observable<void> {
    const docRef = doc(db, this.collectionName, id);
    return from(deleteDoc(docRef));
  }
}