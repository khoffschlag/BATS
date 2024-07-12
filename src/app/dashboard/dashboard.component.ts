import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  users: any[] = [];

  constructor(private apiService: ApiService) { }
    ngOnInit(): void {
    this.apiService.getUsers().subscribe(data => {
        this.users = data;
      });
    }
}
