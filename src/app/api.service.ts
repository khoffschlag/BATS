import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';
import { ExerciseData } from './exercise-data.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private url = environment.apiUrl;
  private authStatus = new BehaviorSubject<boolean>(false);
  authStatus$ = this.authStatus.asObservable();

  constructor(private http: HttpClient) {}

  getTheory(topic: string): Observable<any> {
    return this.http.post(`${this.url}/theory/`, { topic: topic });
  }

  getExercise(topic: string): Observable<any> {
    return this.http.post(`${this.url}/exercise/`, { topic: topic });
  }

  checkExercise(exerciseData: ExerciseData): Observable<any> {
    return this.http.post(`${this.url}/check/`, { data: exerciseData });
  }

  getQuiz(): Observable<any> {
    return this.http.get(`${this.url}/quiz/`);
  }

  signIn(credentials: { username: string; password: string }): Observable<any> {
    return this.http
      .post(`${this.url}/sign-in`, credentials, { withCredentials: true })
      .pipe(
        tap(() => {
          this.authStatus.next(true); // Update auth status on successful login
        })
      );
  }

  signUp(credentials: {
    username: String;
    password: String;
    correctAnswerStreak?: number;
  }) {
    return this.http.post(`${this.url}/sign-up`, credentials);
  }

  logout(): Observable<any> {
    return this.http
      .post(`${this.url}/logout`, {}, { withCredentials: true })
      .pipe(
        tap(() => {
          this.authStatus.next(false); // Update auth status on successful logout
          localStorage.clear();
        })
      );
  }

  checkAuthStatus(): Observable<{ isAuthenticated: boolean }> {
    return this.http
      .get<{ isAuthenticated: boolean }>(`${this.url}/is-authenticated`, {
        withCredentials: true,
      })
      .pipe(
        tap((response) => {
          this.authStatus.next(response.isAuthenticated); // Update auth status
        }),
        catchError(() => {
          this.authStatus.next(false); // Default to not authenticated on error
          return of({ isAuthenticated: false }); // Return default value
        })
      );
  }

  updateStreak(correctAnswerStreak: number): Observable<any> {
    return this.http.post(
      `${this.url}/update-streak`,
      { correctAnswerStreak: correctAnswerStreak },
      { withCredentials: true }
    );
  }

  getUsers(): Observable<any> {
    return this.http.get(`${this.url}/users`);
  }

  isAuthenticated(): Observable<boolean> {
    return this.http
      .get<{ isAuthenticated: boolean }>(`${this.url}/is-authenticated`, {
        withCredentials: true,
      })
      .pipe(map((response) => response.isAuthenticated));
  }

  checkUserStreak(): Observable<number> {
    return this.http
      .get<{ streak: number }>(`${this.url}/check-streak`, {
        withCredentials: true,
      })
      .pipe(map((response) => response.streak));
  }
}
