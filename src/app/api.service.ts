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
    return this.http.get(`${this.url}/theory/${topic}`);
  }

  getExercise(topic: string): Observable<any> {
    return this.http.get(`${this.url}/exercise/${topic}`);
  }

  checkExercise(topic: string, userAnswer:string, targetAnswer:string): Observable<any> {
    return this.http.post(`${this.url}/check/${topic}`, {userAnswer: userAnswer, targetAnswer: targetAnswer});
  }

}
