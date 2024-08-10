import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { v4 as uuidv4 } from 'uuid';

/**
 * @file behavior-logger.service.ts
 * @description This service is responsible for logging user behaviors such as button clicks, page views,
 * and other interactions. The logs are sent to a backend API for storage in a MongoDB database.
 */
@Injectable({
  providedIn: 'root',
})

/**
 * @class UserLoggerService
 * @description Provides methods to log user behaviors and send them to a backend API.
 * The service generates a unique user ID for each user on their first visit and stores it in local storage.
 */
export class UserLoggerService {
  private apiUrl = 'http://localhost:3000/api/log';
  private userId: String;

  /**
   * @constructor
   * @param {HttpClient} http - Angular's HttpClient for making HTTP requests.
   * @description Initializes the service and generates or retrieves the user ID from local storage.
   */
  constructor(private http: HttpClient) {
    this.userId = this.getUserId();
    console.log(`Generated userId: ${this.userId}`);
  }

  /**
   * @private
   * @method getUserId
   * @returns {string} The unique user ID.
   * @description Retrieves the user ID from local storage or generates a new one if it doesn't exist.
   */
  private getUserId(): String {
    let userId = localStorage.getItem('userId');
    if (!userId) {
      userId = uuidv4();
      localStorage.setItem('userId', userId);
    }
    return userId;
  }

  /**
   * @method logBehavior
   * @param {string} eventType - The type of event being logged (e.g., 'button_click').
   * @param {any} eventData - Additional data related to the event (e.g., button ID).
   * @description Logs user behavior and sends it to the backend API.
   */
  logBehavior(eventType: String, eventData: any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const behavior = {
      userId: this.userId,
      eventType,
      eventData,
      timestamp: new Date().toISOString(),
    };

    this.http.post<any>(this.apiUrl, behavior, { headers }).subscribe({
      next: (response) => console.log('Behavior logged successfully', response),
      error: (error) => console.error('Error logging behavior: ', error),
    });
  }
}
