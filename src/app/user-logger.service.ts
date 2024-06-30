import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class UserLoggerService {


  private apiUrl = "http://localhost:3000/api/log";
  private userId : String;

  constructor(private http : HttpClient) { 
    this.userId = this.getUserId();
    console.log(`Generated userId: ${this.userId}`);
  }

  private getUserId() : String {
  let userId = localStorage.getItem('userId');
    if (!userId) {
      userId = uuidv4();
      localStorage.setItem('userId', userId);
    }
    return userId;
  }

  logBehavior(eventType: String, eventData: any) {
    const behavior = {
      userId: this.userId,
      eventType,
      eventData,
      timestamp: new Date(),
    };

    this.http.post(this.apiUrl, behavior).subscribe({
      next: (response) => console.log('Behavior logged successfully', response),
      error: (error) => console.error('Error logging behavior: ', error)
    });
  }
  
}

