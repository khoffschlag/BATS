import { Component, OnInit } from '@angular/core';
import { UserLoggerService } from '../user-logger.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements OnInit{
  constructor(private behaviorLogger: UserLoggerService) {
  }

  ngOnInit(): void {
    this.trackExercisePage();
  }

  trackExercisePage() {
    const eventType = 'page loaded';
    const eventData = { page: "About" };
    this.behaviorLogger.logBehavior(eventType, eventData);
  }
}
