import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../api.service';

/**
 * This component handles the user authentication process including login and registration.
 * @component AuthComponent
 */
@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent implements OnInit {
  isAuthenticated = false;
  correctAnswerStreak: number | undefined;
  saveStreak: string = '0';
  register: boolean = false;

  /**
   * Initializes the AuthComponent with necessary services.
   * @constructor
   * @param {FormBuilder} formBuilder - The form builder service used to create the forms.
   * @param {ApiService} apiService - The API service used for authentication requests.
   * @param {Router} router - The router service used for navigation.
   */
  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.apiService.authStatus$.subscribe((isAuthenticated) => {
      this.isAuthenticated = isAuthenticated;
    });

    this.apiService.checkAuthStatus().subscribe();
  }

  /**
   * The form group for handling login input fields and validation.
   * @property {FormGroup} form
   */
  form: FormGroup = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  /**
   * Handles the registration process. Submits the registration form to the API service.
   * @method signUp
   */
  signUp(e: Event) {
    // do not reload every time when submitted
    e.preventDefault();
    const streakString = localStorage.getItem('correctAnswerStreak');
    let correctAnswerStreak = 0;

    if (streakString) {
      correctAnswerStreak = JSON.parse(streakString);
    }
    const signUpData = {
      ...this.form.value,
      correctAnswerStreak: correctAnswerStreak,
    };
    console.log('sign up data:', signUpData);
    this.apiService.signUp(signUpData).subscribe({
      next: () => {
        this.register = false;
        const modal_show: any = document.getElementById('modal_success');
        modal_show.showModal();
        localStorage.removeItem('correctAnswerStreak');
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
        const modal_show: any = document.getElementById('modal_fail');
        modal_show.showModal();
      },
    });
  }

  /**
   * Handles the login process. Submits the login form to the API service.
   * @method signIn
   */
  signIn(e: Event) {
    e.preventDefault();

    const streakString = localStorage.getItem('correctAnswerStreak');
    let correctAnswerStreak = null;

    if (streakString) {
      correctAnswerStreak = JSON.parse(streakString);
      localStorage.removeItem('correctAnswerStreak');
    }
    const signInData = {
      ...this.form.value,
      correctAnswerStreak: correctAnswerStreak,
    };
    this.apiService.signIn(signInData).subscribe({
      next: () => {
        this.router.navigate(['/leaderboard']);
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
        if (error.status === 401) {
          const modal_show: any = document.getElementById(
            'modal_wrong_credentials'
          );
          modal_show.showModal();
        }
      },
    });
  }

  /**
   * Handles the update of the record for the user.
   * @method updateStreak
   */
  updateStreak(streak: number) {
    this.apiService.updateStreak(streak).subscribe({
      next: () => {
        console.log('Streak updated successfully');
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error updating streak', error);
      },
    });
  }
}
