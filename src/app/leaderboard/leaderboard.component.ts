import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.css',
})
export class LeaderboardComponent implements OnInit {
  users: any[] = [];

  constructor(private apiService: ApiService) {}
  ngOnInit(): void {
    this.apiService.getUsers().subscribe((data) => {
      this.users = this.sortUsersByStreak(data);
    });
  }

  sortUsersByStreak(users: any[]): any[] {
    return users.sort((a, b) => b.correctAnswerStreak - a.correctAnswerStreak);
  }
}
