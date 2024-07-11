import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{

  isAuthenticated = false;

  constructor(
    public apiService: ApiService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.apiService.authStatus$.subscribe(
      (isAuthenticated) => {
        this.isAuthenticated = isAuthenticated;
        this.cdr.detectChanges(); 
      }
    );
  }
  
  login() {
    this.router.navigate(['/auth']);
  }

  logout(){
    this.apiService.logout().subscribe({
      next: () => {
        console.log('Logged out successfully');
        this.router.navigate(['']);
      },
      error: (error) => {
        console.error('Logout failed', error);
      },
    });
  }
}
