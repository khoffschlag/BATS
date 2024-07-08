import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ExerciseData } from './exercise-data.model';

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

  checkExercise(exerciseData: ExerciseData): Observable<any> {
    return this.http.post(`${this.url}/check/`, {data: exerciseData});
  }

  getQuiz(): Observable<any> {
    return this.http.get(`${this.url}/quiz/`);
  }

  signIn(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.url}/sign-in`, credentials, { withCredentials: true });
  }

  signUp(credentials: {username: String, password: String}) {
    return this.http.post(`${this.url}/sign-up`, credentials);
  }

  logout() {
    return this.http.post(`${this.url}/logout`, {});
  }

  isAuthenticated(): Observable<boolean> {
    return this.http.get<{ isAuthenticated: boolean }>(`${this.url}/is-authenticated`, { withCredentials: true }).pipe(
      map(response => response.isAuthenticated)
    );
  }

}
