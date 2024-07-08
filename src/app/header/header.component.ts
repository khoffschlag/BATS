import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{

  isAuthenticated$: Observable<boolean>;

  constructor(
    public apiService: ApiService,
    private router: Router
  ) {this.isAuthenticated$ = this.apiService.isAuthenticated();}

  ngOnInit(): void {
    this.isAuthenticated$ = this.apiService.isAuthenticated();
  }
  
  login() {
    this.router.navigate(['/auth']);
  }

  logout(){
    this.apiService.logout().subscribe({
      next: () => {
        console.log('Logged out successfully');
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Logout failed', error);
      },
    });
  }
}
