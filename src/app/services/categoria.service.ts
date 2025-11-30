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
import { Categoria } from '../models/categoria.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private collectionName = 'categorias';

  constructor() { }

  getAll(): Observable<Categoria[]> {
    const q = collection(db, this.collectionName);
    return from(getDocs(q)).pipe(
      map(snapshot => snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as Categoria)))
    );
  }

  getById(id: string): Observable<Categoria> {
    const docRef = doc(db, this.collectionName, id);
    return from(getDoc(docRef)).pipe(
      map(snapshot => ({ id: snapshot.id, ...snapshot.data() } as Categoria))
    );
  }

  create(categoria: Omit<Categoria, 'id'>): Observable<string> {
    const categoriaConTimestamp = {
      ...categoria,
      createdAt: serverTimestamp()
    };
    const colRef = collection(db, this.collectionName);
    return from(addDoc(colRef, categoriaConTimestamp)).pipe(
      map(docRef => docRef.id)
    );
  }

  update(id: string, categoria: Partial<Categoria>): Observable<void> {
    const docRef = doc(db, this.collectionName, id);
    return from(updateDoc(docRef, categoria));
  }

  updatePartial(id: string, updates: Partial<Categoria>): Observable<void> {
    const docRef = doc(db, this.collectionName, id);
    return from(updateDoc(docRef, updates));
  }

  delete(id: string): Observable<void> {
    const docRef = doc(db, this.collectionName, id);
    return from(deleteDoc(docRef));
  }
}