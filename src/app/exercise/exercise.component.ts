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

  data = {topic: "", task: "", answer: ""};
  userInput: string = "";
  notFinished: boolean = true;
  feedback: string = "";

  constructor(private api: ApiService) {

    this.param = this.route.snapshot.params['topic'];

    if (this.param = "binaryConversion") {
      this.api.getBinaryConversionExercise().subscribe(data => this.data = {
        topic: (data as any).topic,
        task:  (data as any).task,
        answer: (data as any).answer
      });
    }

  }

  checkAnswer() {
    if (this.userInput == this.data.answer) {
      this.feedback = "Great! You're answer is correct! Feel free to go to next exercise!"
      this.notFinished = false;
    }
    else {
      this.feedback = "You're answer is not correct. Please try again!"
    }
    
  }

}
