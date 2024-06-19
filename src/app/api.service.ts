import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private url = "http://localhost:3000/api"

  constructor(private http: HttpClient) { }

  getTheory(topic: string): Observable<any> {
    return this.http.post(`${this.url}/theory/`, {topic: topic});
  }

  getExercise(topic: string): Observable<any> {
    return this.http.post(`${this.url}/exercise/`, {topic: topic});
  }

  checkExercise(topic: string, userAnswer:string, targetAnswer:string): Observable<any> {
    return this.http.post(`${this.url}/check/`, {topic: topic, userAnswer: userAnswer, targetAnswer: targetAnswer});
  }

}
