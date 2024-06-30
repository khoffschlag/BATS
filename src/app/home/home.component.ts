import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserLoggerService } from '../user-logger.service';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{

  constructor(private behaviorLogger: UserLoggerService) {
  }

  ngOnInit(): void {
    this.trackExercisePage();
  }

  trackExercisePage() {
    const eventType = 'page loaded';
    const eventData = { page: "home" };
    this.behaviorLogger.logBehavior(eventType, eventData);
  }


}
