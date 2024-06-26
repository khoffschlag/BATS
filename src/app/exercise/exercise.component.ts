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

  current_level = 1;
  helpers = [128, 64, 32, 16, 8, 4, 2, 1];  // Only available when using level 1

  constructor(private api: ApiService) {

    this.data.topic = this.route.snapshot.params['topic'];
    this.newExercise();

  }

  checkAnswer() {
      const modal: any = document.getElementById('my_modal_2');
      this.api.checkExercise(this.data).subscribe(response => {
        this.data.result = (response as any).result;
        this.data.feedback = (response as any).feedback;

        if (this.data.result) {
          this.correctAnswerStreak += 1;
          this.disableCheckButton = true;
        } else {
          this.correctAnswerStreak = 0;
        }
        if(modal){
          modal.showModal();
        }
      })

  }

  newExercise() {
    let topic = this.data.topic;
    this.data = new ExerciseData();
    this.data.topic = topic;
    if (this.data.topic == 'decimalConversion') {
      this.data.userAnswer = 0;
      this.data.targetAnswer = -1;
    }
    this.disableCheckButton = false;

    this.api.getExercise(this.data.topic).subscribe(response => {
      this.data.title = (response as any).title;
      this.data.task = (response as any).task;
      this.data.targetAnswer = (response as any).targetAnswer;
    });

  }

  getDigit(index: number) {
    // This method is needed because if we directly return the single digit in the component html without the Array check, we get an error
    if (Array.isArray(this.data.userAnswer)) {
      return this.data.userAnswer[index];
    }
    else {
      console.log('Can only index arrays (and lists)!');
      return -1;
    }

  }

  toggleDigit(index: number) {
    if (Array.isArray(this.data.userAnswer)) {
      this.data.userAnswer[index] = this.data.userAnswer[index] ^ 1; // Xor-operation to negate number
    }
    else {
      console.log('Can only toggle buttons!');
    }
  }

  setLevel(level: number) {
    this.current_level = level;
  }

  ensureArray(input : number | number[]) {
    if (Array.isArray(input)) {
      return input;
    }
    else {
      return [input];
    }
  }

  
}
