import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-exercise',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './exercise.component.html',
  styleUrl: './exercise.component.css'
})
export class ExerciseComponent {

  route: ActivatedRoute = inject(ActivatedRoute);
  param: string = "";

  data = { topic: "", task: "", targetAnswer: "" };
  checkingResult = { result: false, feedback: "" };

  userAnswer: string = "";
  correctAnswerStreak: number = 0;
  disableCheckButton: boolean = false;

  constructor(private api: ApiService) {

    this.param = this.route.snapshot.params['topic'];
    this.newExercise();

  }


  checkAnswer() {

      this.api.checkExercise(this.param, this.userAnswer, this.data.targetAnswer).subscribe(data => {
        this.checkingResult = { result: (data as any).result, feedback: (data as any).feedback };
        this.updateAnswerStreak(this.checkingResult);
      })

  }

  updateAnswerStreak(checkingResult: object) {

    if (this.checkingResult.result) {
      this.correctAnswerStreak += 1;
      this.disableCheckButton = true;
    } else {
      this.correctAnswerStreak = 0;
    }

  }

  newExercise() {

    this.data = { topic: "", task: "", targetAnswer: "" };
    this.checkingResult = { result: false, feedback: "" };
    this.disableCheckButton = false;

    this.api.getExercise(this.param).subscribe(data => this.data = {
      topic: (data as any).topic,
      task:  (data as any).task,
      targetAnswer: (data as any).targetAnswer
    });

  }

}
