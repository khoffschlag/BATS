import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../api.service';


@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent implements OnInit {

  isAuthenticated = false;
  correctAnswerStreak: number | undefined;
  saveStreak: string = '0';
  register: boolean = false;

  constructor (private formBuilder: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {}

    ngOnInit(): void {
      this.apiService.authStatus$.subscribe(
        (isAuthenticated) => {
          this.isAuthenticated = isAuthenticated;
        }
      ):

    this.apiService.checkAuthStatus().subscribe();
  }


  form: FormGroup = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  signUp(e: Event) {
    // do not reload every time when submitted
    e.preventDefault();
    const quizResultsString = localStorage.getItem('quizResults');
    let quizResults = null;

    if (quizResultsString) {
      quizResults = JSON.parse(quizResultsString);
      localStorage.removeItem('quizResults'); 
    }
    const signUpData  = {
      ...this.form.value,
      quizResults: quizResults,
    };
    this.apiService.signUp(signUpData).subscribe({
      next: () => {
        this.register = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
      }
    });
  }

  signIn(e: Event) {
    e.preventDefault();

    const quizResultsString = localStorage.getItem('quizResults');
    let quizResults = null;

    if (quizResultsString) {
      quizResults = JSON.parse(quizResultsString);
      localStorage.removeItem('quizResults'); 
    }
    const signInData  = {
      ...this.form.value,
      quizResults: quizResults,

    };
    this.apiService.signIn(signInData).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
      }
    });
  }

  updateStreak( streak: number) {
    this.apiService.updateStreak(streak).subscribe({
      next: () => {
        console.log('Streak updated successfully');
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error updating streak', error);
      }
    });
  }
}
