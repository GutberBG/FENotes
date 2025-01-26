import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface NoteDTO {
  id: number;
  title: string;
  content: string;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
  userId: number;
  tags: string[];
}

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

  createNote(note: NoteDTO, token: string): Observable<NoteDTO> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post<NoteDTO>(this.apiUrl, note, { headers });
  }

  updateNote(id: number, note: any, token: string) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<any>(`${this.apiUrl}/${id}`, note, { headers });
  }

   // Método para archivar una nota
   archiveNote(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/archive`, {});
  }

  // Método para desarchivar una nota
  unarchiveNote(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/unarchive`, {});
  }

  // Método para eliminar una nota
  deleteNote(id: number): Observable<Object> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  searchNotes(userId: number, query: string): Observable<any[]> {
    const url = `${this.apiUrl}/search?userId=${userId}&query=${query}`;
    return this.http.get<any[]>(url);
  }
}
