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
import { db } from '../firebase.config';
import { Pedido } from '../models/pedido.model';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private collectionName = 'pedidos';

  constructor() { }

  getAll(): Observable<Pedido[]> {
    const q = collection(db, this.collectionName);
    return from(getDocs(q)).pipe(
      map(snapshot => snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Pedido)))
    );
  }

  getById(id: string): Observable<Pedido> {
    const docRef = doc(db, this.collectionName, id);
    return from(getDoc(docRef)).pipe(
      map(snapshot => ({ id: snapshot.id, ...snapshot.data() } as Pedido))
    );
  }

  create(pedido: Omit<Pedido, 'id'>): Observable<Pedido> {
    const colRef = collection(db, this.collectionName);
    return from(addDoc(colRef, pedido)).pipe(
      map(docRef => ({ ...pedido, id: docRef.id } as Pedido))
    );
  }

  update(id: string, pedido: Partial<Pedido>): Observable<void> {
    const docRef = doc(db, this.collectionName, id);
    return from(updateDoc(docRef, pedido));
  }

  delete(id: string): Observable<void> {
    const docRef = doc(db, this.collectionName, id);
    return from(deleteDoc(docRef));
  }
}