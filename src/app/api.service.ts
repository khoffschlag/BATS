import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private url = "http://localhost:3000/api"

  constructor(private http: HttpClient) { }

  getBinaryConversionTheory(): Observable<any> {
    return this.http.get(`${this.url}/theory/binaryConversion`);
  }

  getBinaryConversionExercise(): Observable<any> {
    return this.http.get(`${this.url}/exercise/binaryConversion`);
  }

}
