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
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase.config';
import { Cliente } from '../models/cliente.model';

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private collectionName = 'clientes';

  constructor() {}

  getAll(): Observable<Cliente[]> {
    const q = collection(db, this.collectionName);
    return from(getDocs(q)).pipe(
      map(snapshot => snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Cliente)))
    );
  }

  getById(id: string): Observable<Cliente> {
    const docRef = doc(db, this.collectionName, id);
    return from(getDoc(docRef)).pipe(
      map(snapshot => ({ id: snapshot.id, ...snapshot.data() } as Cliente))
    );
  }

  create(cliente: Omit<Cliente, 'id'>): Observable<{ id: string }> {
    const clienteConTimestamp = {
      ...cliente,
      createdAt: serverTimestamp()
    };
    const colRef = collection(db, this.collectionName);
    return from(addDoc(colRef, clienteConTimestamp)).pipe(
      map(docRef => ({ id: docRef.id }))
    );
  }

  update(id: string, cliente: Partial<Cliente>): Observable<void> {
    const docRef = doc(db, this.collectionName, id);
    return from(updateDoc(docRef, cliente));
  }

  delete(id: string): Observable<void> {
    const docRef = doc(db, this.collectionName, id);
    return from(deleteDoc(docRef));
  }



  
}