import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TagsService {
  private apiUrl = environment.apiUrl + '/tags'; // Cambia según la URL de tu API

  constructor(private http: HttpClient) {}

  // Obtener los tags por usuario
  getTagsByUser(userId: number, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get(`${this.apiUrl}/user/${userId}`, { headers });
  }
}
