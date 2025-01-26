import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  private apiUrl = 'http://localhost:8080/api/notes'; // Cambia según la URL de tu API

  constructor(private http: HttpClient) {}

  // Obtener todas las notas de un usuario
  getNotesByUser(userId: number, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const params = {};
    return this.http.get(`${this.apiUrl}/user/${userId}`, { headers, params, responseType: 'json' });
  }

  // Obtener notas archivadas de un usuario
  getUserArchivedNotes(userId: number, archived: boolean): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/${userId}/archived`, { params: { archived: archived.toString() } });
  }

  // Obtener todas las notas no archivadas de un usuario
  getNotesByUserAndArchived(userId: number, archived: boolean, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const params = { archived: archived.toString() };
    return this.http.get(`${this.apiUrl}/user/${userId}/archived`, { headers, params, responseType: 'json' });
  }
}
