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

  constructor (private formBuilder: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {}
    ngOnInit(): void {
    // Retrieving correctAnswerStreak from the local storage
    const streak = localStorage.getItem('correctAnswerStreak');
    if (streak) {
      this.correctAnswerStreak = +streak;
    }
  }

  register: boolean = false;
  correctAnswerStreak : number = 0;

  form: FormGroup = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  signUp(e: Event) {
    // do not reload every time when submitted
    e.preventDefault();
    const signUpData  = {
      ...this.form.value,
      correctAnswerStreak: this.correctAnswerStreak
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
    const signUpData  = {
      ...this.form.value,
      correctAnswerStreak: this.correctAnswerStreak
    };

    this.apiService.signIn(signUpData).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
      }
    });
  }

  updateStreak(username: string, streak: number) {
    this.apiService.updateStreak(username, streak).subscribe({
      next: () => {
        console.log('Streak updated successfully');
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error updating streak', error);
      }
    });
  }
}
