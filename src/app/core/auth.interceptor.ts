import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const currentUser = localStorage.getItem('currentUser');
    let token = null;
    let userId = null;

    if (currentUser) {
      const user = JSON.parse(currentUser);
      token = user.token;
      console.log("adasdasdas");
      console.log(token)  // Obtén el token
      userId = user.userId;  // Obtén el userId
    }

    // Clonar la solicitud y agregar el token en los encabezados si existe
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(req);
  }
}