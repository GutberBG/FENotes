import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/api/auth'; // Cambia la URL según tu backend.
  private currentUserSubject = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(credentials: { username: string; password: string }): Observable<any> {
    const params = new HttpParams()
      .set('username', credentials.username)
      .set('password', credentials.password);
  
    return this.http.post(`${this.apiUrl}/login`, null, { params, responseType: 'text' }).pipe(
      map((response: string) => { // La respuesta es un string (token)
        if (response) {
          const user = { token: response }; // Se guarda el token
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }
        return response;
      }),
      catchError((error) => {
        // Maneja el error
        console.error('Login failed', error);
        throw error;
      })
    );
  }
  
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): Observable<any> {
    return this.currentUserSubject.asObservable();
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('currentUser');
  }
}
