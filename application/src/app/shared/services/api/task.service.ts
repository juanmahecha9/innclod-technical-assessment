import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, retry, throwError } from 'rxjs';

export interface ResponseTask {
  UserId: number;
  id: number;
  title: string;
  completed: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private URL: string = 'https://jsonplaceholder.typicode.com/todos';
  constructor(private http: HttpClient) {}

  getTasks(): Observable<ResponseTask[]> {
    const baseHeaders = new HttpHeaders().set(
      'Content-Type',
      'application/json'
    );
    return this.http
      .get<ResponseTask[]>(`${this.URL}`, {
        headers: baseHeaders,
      })
      .pipe(
        retry(2),
        map((res) => {
          // Validar que la respuesta tiene el formato correcto
          if (!res || typeof res !== 'object' || !Object.keys(res).length) {
            throw new Error('Datos inválidos');
          }
          return res;
        }),
        catchError((error) => {
          console.error('Error en la solicitud:', error);
          return throwError(() => new Error('Error en la solicitud de datos.'));
        })
      );
  }
}
