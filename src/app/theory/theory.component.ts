import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserLoggerService } from '../user-logger.service';

@Component({
  selector: 'app-theory',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './theory.component.html',
  styleUrl: './theory.component.css'
})
export class TheoryComponent implements OnInit {

  // A dummy model to avoid problems
  tutorial = {
    title: '',
    description: '',
    sections: [
      {
        title: '',
        content: '',
      }
    ]
  };




  topic: string = '';
  

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router,
    private behaviorLogger: UserLoggerService
  ) { }

  ngOnInit(): void {
    this.topic = this.route.snapshot.params['topic'];
      if (this.topic) {
        this.fetchTutorial(this.topic);
      }
    this.trackExercisePage();
    }

  trackExercisePage() {
    const eventType = 'page loaded';
    const eventData = { page: `theory: ${this.topic}` };
    this.behaviorLogger.logBehavior(eventType, eventData);
  }

  trackButtonOverviewClick(){
    console.log('Tracking button click');
    const eventType = 'button_click';
    const eventData = {page: `theory to overview: ${this.topic}`};
    this.behaviorLogger.logBehavior(eventType, eventData);
  }

  fetchTutorial(topic: string): void {
    this.apiService.getTheory(topic).subscribe({
      next: (data) => {
        this.tutorial = data;
        console.log('Tutorial:', this.tutorial);
      },
      error: (error) => {
        console.error('Error fetching tutorial', error);
      }
    });
  }
  goToOverview() {
    this.router.navigate(['/overview']);
    this.trackButtonOverviewClick()
  }
}
