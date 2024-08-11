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

  /**
  * Logs in a user.
  * @param {Object} credentials - The user credentials.
  * @param {string} credentials.username - The username of the user.
  * @param {string} credentials.password - The password of the user.
  * @returns {Observable<any>} An observable of the HTTP response.
  */
  signIn(credentials: { username: string; password: string }): Observable<any> {
    return this.http
      .post(`${this.url}/sign-in`, credentials, { withCredentials: true })
      .pipe(
        tap(() => {
          this.authStatus.next(true); // Update auth status on successful login
        })
      );
  }

  /**
   * Registers a new user.
   * @param {Object} credentials - The user credentials.
   * @param {string} credentials.username - The desired username.
   * @param {string} credentials.password - The desired password.
   * @param {Array} [credentials.correctAnswerStreak] - Optional quiz results.
   * @returns {Observable<any>} An observable of the HTTP response.
   */
  signUp(credentials: {
    username: String;
    password: String;
    correctAnswerStreak?: number;
  }) {
    return this.http.post(`${this.url}/sign-up`, credentials);
  }

  /**
   * Logs out the current user.
   * @returns {Observable<any>} An observable of the HTTP response.
   */
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

  /**
   * Checks the authentication status of the current user.
   * @param {boolean} isAuthenticated - The authentication status of the current user.
   * @returns {Observable<any>} An observable of the HTTP response.
   */
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

  /**
   * Updates the streak value.
   * @param {Number} correctAnswerStreak - the streak value.
   * @returns {Observable<any>} An observable of the HTTP response.
   */
  updateStreak(correctAnswerStreak: number): Observable<any> {
    return this.http.post(
      `${this.url}/update-streak`,
      { correctAnswerStreak: correctAnswerStreak },
      { withCredentials: true }
    );
  }

  /**
   * Returns the username in the database.
   * @returns {Observable<any>} An observable of the HTTP response.
   */ 
  getUsers(): Observable<any> {
    return this.http.get(`${this.url}/users`);
  }

  /**
   * Handles the authentication status of the current user.
   * @returns {Observable<boolean>} An observable of the HTTP response.
   */  
  isAuthenticated(): Observable<boolean> {
    return this.http
      .get<{ isAuthenticated: boolean }>(`${this.url}/is-authenticated`, {
        withCredentials: true,
      })
      .pipe(map((response) => response.isAuthenticated));
  }

  /**
   * Retrieves the users current streak value.
   * @returns {Observable<number>} An observable of the HTTP response.
   */
  checkUserStreak(): Observable<number> {
    return this.http
      .get<{ streak: number }>(`${this.url}/check-streak`, {
        withCredentials: true,
      })
      .pipe(map((response) => response.streak));
  }
}
