import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ExerciseData } from '../exercise-data.model';
import { ApiService } from '../api.service';
import { UserLoggerService } from '../user-logger.service';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.css'
})
export class QuizComponent {

  topic: string = ''
  data: ExerciseData = new ExerciseData();

  constructor(private api: ApiService, private behaviorLogger: UserLoggerService) {

    this.newExercise();

  }

  newExercise() {
    let topic = this.data.topic;
    this.data = new ExerciseData();
    this.data.topic = topic;
    if (this.data.topic == 'decimalConversion') {
      this.data.userAnswer = 0;
      this.data.targetAnswer = -1;
    }
    //this.disableCheckButton = false;

    this.api.getQuiz().subscribe(response => { // <----------------------------------- getQuiz instead of getExercise and we don't pass any data to API
      this.topic = (response as any).topic;  // <----------------------------------- this is new
      this.data.title = (response as any).title;
      this.data.task = (response as any).task;
      this.data.targetAnswer = (response as any).targetAnswer;
    });
    //this.trackButtonNextExerciseClick()

  }

}
