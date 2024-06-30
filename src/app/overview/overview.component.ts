import { Component, OnInit} from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserLoggerService } from '../user-logger.service';


@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css'
})
export class OverviewComponent implements OnInit{
  constructor(private behaviorLogger: UserLoggerService) {
  }

  ngOnInit(): void {
    this.trackExercisePage();
  }

  trackExercisePage() {
    const eventType = 'page loaded';
    const eventData = { page: "overview" };
    this.behaviorLogger.logBehavior(eventType, eventData);
  }
  
}
