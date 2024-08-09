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
      );

    this.apiService.checkAuthStatus().subscribe();
  }


  form: FormGroup = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  signUp(e: Event) {
    // do not reload every time when submitted
    e.preventDefault();
    const streakString = localStorage.getItem('correctAnswerStreak');
    let correctAnswerStreak = 0 ;

    if (streakString) {
      correctAnswerStreak = JSON.parse(streakString); 
    }
    const signUpData  = {
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
      }
    });
  }

  signIn(e: Event) {
    e.preventDefault();

    const streakString = localStorage.getItem('correctAnswerStreak');
    let correctAnswerStreak = null;

    if (streakString) {
      correctAnswerStreak = JSON.parse(streakString);
      localStorage.removeItem('correctAnswerStreak'); 
    }
    const signInData  = {
      ...this.form.value,
      correctAnswerStreak: correctAnswerStreak,

    };
    this.apiService.signIn(signInData).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
        if (error.status === 401) {
          const modal_show: any = document.getElementById('modal_wrong_credentials');
          modal_show.showModal();
      }
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
