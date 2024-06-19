import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { FormsModule } from '@angular/forms';
import { ExerciseData } from '../exercise-data.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exercise',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './exercise.component.html',
  styleUrl: './exercise.component.css'
})
export class ExerciseComponent {

  route: ActivatedRoute = inject(ActivatedRoute);

  data: ExerciseData = new ExerciseData();
  correctAnswerStreak: number = 0;
  disableCheckButton: boolean = false;

  constructor(private api: ApiService) {

    this.data.topic = this.route.snapshot.params['topic'];
    this.newExercise();

  }

  checkAnswer() {

      this.api.checkExercise(this.data).subscribe(response => {
        this.data.result = (response as any).result;
        this.data.feedback = (response as any).feedback;

        if (this.data.result) {
          this.correctAnswerStreak += 1;
          this.disableCheckButton = true;
        } else {
          this.correctAnswerStreak = 0;
        }
      })

  }

  newExercise() {
    let topic = this.data.topic;
    this.data = new ExerciseData();
    this.data.topic = topic;
    this.disableCheckButton = false;

    this.api.getExercise(this.data.topic).subscribe(response => {
      this.data.title = (response as any).title;
      this.data.task = (response as any).task;
      this.data.targetAnswer = (response as any).targetAnswer;
    });

  }

  toggleDigit(index: number) {
    this.data.userAnswer[index] = this.data.userAnswer[index] ^ 1; // Xor-operation to negate number
  }

}
