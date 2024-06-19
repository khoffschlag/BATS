import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

}
