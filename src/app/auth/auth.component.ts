import { Component } from '@angular/core';
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
export class AuthComponent {

  constructor (private formBuilder: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {}

  register: boolean = false;

  form: FormGroup = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  signUp(e: Event) {
    // do not reload every time when submitted
    e.preventDefault();

    this.apiService.signUp(this.form.value).subscribe({
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

    this.apiService.signIn(this.form.value).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
      }
    });
  }
}
