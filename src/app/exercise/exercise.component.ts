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
  notFinished: boolean = true;
  feedback: string = "";

  constructor(private api: ApiService) {

    this.param = this.route.snapshot.params['topic'];

    if (this.param == "binaryConversion") {
      this.api.getBinaryConversionExercise().subscribe(data => this.data = {
        topic: (data as any).topic,
        task:  (data as any).task,
        targetAnswer: (data as any).targetAnswer
      });
    }

  }

  checkAnswer() {

    if (this.param == "binaryConversion") {
      this.api.checkBinaryConversion(this.userAnswer, this.data.targetAnswer).subscribe(data => {
        this.checkingResult = { result: (data as any).result, feedback: (data as any).feedback };
        this.feedback = this.checkingResult.feedback;
        this.notFinished = !this.checkingResult.result;
    })};

  }

}
