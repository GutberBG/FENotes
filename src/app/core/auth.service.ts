import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl + '/auth'; // Cambia la URL según tu backend.
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

      const storedUser = localStorage.getItem('currentUser');
      console.log('Stored user before login:', storedUser);
  
    return this.http.post(`${this.apiUrl}/login`, null, { params, responseType: 'json' }).pipe(
      map((response: any) => {
        if (response && response.token) {
          const user = { 
            token: response.token,
            userId: response.userId
          };
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          console.log('Login successful' + JSON.stringify(user));
        }
        
        console.log('Stored user after login:', localStorage.getItem('currentUser'));
        console.log(response.token);
        return response;
      }),
      catchError((error) => {
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
