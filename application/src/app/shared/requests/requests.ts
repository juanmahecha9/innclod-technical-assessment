import { Injectable } from '@angular/core';
import { Observable, catchError, finalize, throwError } from 'rxjs';
import { OnError } from '../models/on-error';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class HttpResquests {
  request<T>(serviceRequest: Observable<T>): Observable<T> {
    return serviceRequest.pipe(
      finalize(() => {
        console.log('Petición alcanzada');
      }),
      catchError((error: OnError) => {
        //console.error("Error en la solicitud:", error);
        return throwError(error);
      })
    );
  }
}
