import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase.config';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private collectionName = 'usuarios';

  constructor() {}

  /* ====================== AUTENTICACIÓN ====================== */

  // Login (usando "contraseña" o "password")
  loginUsuario(email: string, contraseña: string): Observable<Usuario> {
    console.log('Login: Buscando usuario por email:', email);
    const q = query(collection(db, this.collectionName), where('email', '==', email));
    return from(getDocs(q)).pipe(
      map(snapshot => {
        console.log('Login: Documentos encontrados:', snapshot.size);
        if (snapshot.empty) {
          console.log('Login: No se encontró usuario con ese email');
          throw new Error('Credenciales inválidas');
        }
        const doc = snapshot.docs[0];
        const userData = doc.data() as Usuario;
        console.log('Login: Datos del usuario encontrado:', userData);
        console.log('Login: Contraseña almacenada:', userData.contraseña);
        console.log('Login: Contraseña proporcionada:', contraseña);

        // Verificar contraseña
        if (userData.contraseña !== contraseña) {
          console.log('Login: Contraseña no coincide');
          throw new Error('Credenciales inválidas');
        }

        console.log('Login: Login exitoso');
        return { id: doc.id, ...userData };
      })
    );
  }

  /* ====================== CRUD USUARIOS ====================== */

  // Registrar usuario con valores por defecto
  registrarUsuario(usuario: Omit<Usuario, 'id'>): Observable<Usuario> {
    console.log('Iniciando registro de usuario:', usuario);
    const usuarioConDefaults = {
      ...usuario,
      active: true,
      rol: 'cliente',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    console.log('Usuario con defaults:', usuarioConDefaults);
    const colRef = collection(db, this.collectionName);
    console.log('Referencia a colección obtenida');
    return from(addDoc(colRef, usuarioConDefaults)).pipe(
      map(docRef => {
        console.log('Documento agregado con ID:', docRef.id);
        const usuarioRegistrado = { ...usuarioConDefaults, id: docRef.id } as Usuario;
        console.log('Usuario registrado:', usuarioRegistrado);
        return usuarioRegistrado;
      })
    );
  }

  // Listar todos
  getUsuarios(): Observable<Usuario[]> {
    const q = collection(db, this.collectionName);
    return from(getDocs(q)).pipe(
      map(snapshot => snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Usuario)))
    );
  }

  // Obtener usuario por ID
  getUsuarioById(id: string): Observable<Usuario> {
    const docRef = doc(db, this.collectionName, id);
    return from(getDoc(docRef)).pipe(
      map(snapshot => ({ id: snapshot.id, ...snapshot.data() } as Usuario))
    );
  }

  // Crear usuario
  createUsuario(usuario: Omit<Usuario, 'id'>): Observable<Usuario> {
    console.log('Creando usuario desde admin:', usuario);
    const usuarioConTimestamps = {
      ...usuario,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    console.log('Usuario con timestamps:', usuarioConTimestamps);
    const colRef = collection(db, this.collectionName);
    return from(addDoc(colRef, usuarioConTimestamps)).pipe(
      map(docRef => {
        console.log('Usuario creado con ID:', docRef.id);
        return { ...usuarioConTimestamps, id: docRef.id } as Usuario;
      })
    );
  }

  // Actualizar usuario (PUT)
  updateUsuario(id: string, usuario: Partial<Usuario>): Observable<void> {
    const docRef = doc(db, this.collectionName, id);
    return from(updateDoc(docRef, usuario));
  }

  // Actualizar parcialmente (PATCH)
  patchUsuario(id: string, partialData: Partial<Usuario>): Observable<void> {
    const dataConTimestamp = {
      ...partialData,
      updatedAt: serverTimestamp()
    };
    const docRef = doc(db, this.collectionName, id);
    return from(updateDoc(docRef, dataConTimestamp));
  }

  // Eliminar usuario
  deleteUsuario(id: string): Observable<void> {
    const docRef = doc(db, this.collectionName, id);
    return from(deleteDoc(docRef));
  }

  /* ====================== UTILIDADES ====================== */

  // Verificar si un email ya está registrado
  verificarEmail(email: string): Observable<boolean> {
    console.log('Verificando email:', email);
    const q = query(collection(db, this.collectionName), where('email', '==', email));
    console.log('Query creada para verificar email');
    return from(getDocs(q)).pipe(
      map(snapshot => {
        const exists = !snapshot.empty;
        console.log('Resultado de verificación de email:', exists, 'Documentos encontrados:', snapshot.size);
        return exists;
      })
    );
  }

  // Método para debug: obtener todos los usuarios
  getAllUsersForDebug(): Observable<Usuario[]> {
    console.log('Debug: Obteniendo todos los usuarios');
    const q = collection(db, this.collectionName);
    return from(getDocs(q)).pipe(
      map(snapshot => {
        console.log('Debug: Total de usuarios en Firestore:', snapshot.size);
        const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Usuario));
        console.log('Debug: Usuarios encontrados:', users);
        return users;
      })
    );
  }
}
