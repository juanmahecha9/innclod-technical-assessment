import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, retry, throwError } from 'rxjs';

export interface ResponseProject {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Address;
  phone: string;
  website: string;
  company: Company;
}

export interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: Geo;
}

export interface Geo {
  lat: string;
  lng: string;
}

export interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private URL: string = 'https://jsonplaceholder.typicode.com/users';
  constructor(private http: HttpClient) {}

  getProjects(): Observable<ResponseProject[]> {
    const baseHeaders = new HttpHeaders().set(
      'Content-Type',
      'application/json'
    );
    return this.http
      .get<ResponseProject[]>(`${this.URL}`, {
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
