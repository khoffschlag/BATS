import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';
import { FormsModule } from '@angular/forms';
import { ExerciseData } from '../exercise-data.model';
import { CommonModule } from '@angular/common';
import { UserLoggerService } from '../user-logger.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-exercise',
  standalone: true,
  imports: [CommonModule, FormsModule, NgClass],
  templateUrl: './exercise.component.html',
  styleUrl: './exercise.component.css',
})
export class ExerciseComponent implements OnInit {
  route: ActivatedRoute = inject(ActivatedRoute);
  data: ExerciseData = new ExerciseData();
  correctAnswerStreak: number = 0;
  disableCheckButton: boolean = true;
  toggleButtonToggled: boolean = false;
  modal: any = document.getElementById('modal_feedback');
  checkBtnPressed: boolean = false;
  feedbackLines: string[] = [];

  current_level = 1;
  helpers = [128, 64, 32, 16, 8, 4, 2, 1]; // Only available when using level 1

  constructor(
    private api: ApiService,
    private router: Router,
    private behaviorLogger: UserLoggerService
  ) {
    this.data.topic = this.route.snapshot.params['topic'];
    this.newExercise();
  }

  ngOnInit(): void {
    this.trackExercisePage();
  }

  trackExercisePage() {
    const eventType = 'page loaded';
    const eventData = { page: `exercise: ${this.data.topic}` };
    this.behaviorLogger.logBehavior(eventType, eventData);
  }

  trackButtonCheckClick() {
    console.log('Tracking button click');
    const eventType = 'button_click';
    const eventData = {
      button_id: 'Check Answer',
      data: this.data,
    };
    this.behaviorLogger.logBehavior(eventType, eventData);
  }

  trackButtonNextExerciseClick() {
    console.log('Tracking button click');
    const eventType = 'button_click';
    const eventData = { page: `next exercise: ${this.data.topic}` };
    this.behaviorLogger.logBehavior(eventType, eventData);
  }

  trackButtonOverviewClick() {
    console.log('Tracking button click');
    const eventType = 'button_click';
    const eventData = { page: `exercise to overview: ${this.data.topic}` };
    this.behaviorLogger.logBehavior(eventType, eventData);
  }

  trackSetLevel() {
    console.log('Tracking level');
    const eventType = 'set_level';
    const eventData = {
      page: `exercise: ${this.data.topic}`,
      level: this.current_level,
    };
    this.behaviorLogger.logBehavior(eventType, eventData);
  }

  /**
   * Redirects to the overview component.
   * @method goToOverview
   */
  goToOverview() {
    this.router.navigate(['/overview']);
    this.trackButtonOverviewClick();
  }

  checkAnswer() {
    const modal: any = document.getElementById('modal_feedback');
    this.checkBtnPressed = true;
    this.api.checkExercise(this.data).subscribe((response) => {
      this.data.result = (response as any).result;
      this.data.feedback = (response as any).feedback;

      if (this.data.result) {
        this.correctAnswerStreak += 1;
        this.data.currentTry = 0;
        this.disableCheckButton = true;
      } else {
        this.data.currentTry += 1;
      }
      if (this.data.currentTry == 2) {
        this.feedbackLines = this.data.feedback.split('\n');
      }
      if (modal) {
        modal.showModal();
      }
    });
    this.trackButtonCheckClick();
  }

  /**
   * If the answer is correct gives new exercise and closes the feedback modal, otherwise just closes the modal.
   * @method onCloseButtonClick
   */
  onCloseButtonClick() {
    if (this.data.result) {
      this.checkBtnPressed = false;
      this.newExercise();
      this.disableCheckButton = true;
    } else {
      this.disableCheckButton = true;
      this.closeDialog();
    }
  }

  /**
   * Closes the feedback modal.
   * @method closeDialog
   */
  closeDialog() {
    if (this.modal) {
      this.modal.close();
    }
  }

  newExercise() {
    let topic = this.data.topic;
    this.data = new ExerciseData();
    this.data.topic = topic;
    if (this.data.topic == 'decimalConversion') {
      this.data.userAnswer = 0;
      this.data.targetAnswer = -1;
    }

    this.api.getExercise(this.data.topic).subscribe((response) => {
      this.data.title = (response as any).title;
      this.data.task = (response as any).task;
      this.data.targetAnswer = (response as any).targetAnswer;
    });
    this.trackButtonNextExerciseClick();
  }

  getDigit(index: number) {
    // This method is needed because if we directly return the single digit in the component html without the Array check, we get an error
    if (Array.isArray(this.data.userAnswer)) {
      return this.data.userAnswer[index];
    } else {
      console.log('Can only index arrays (and lists)!');
      return -1;
    }
  }

  toggleDigit(index: number) {
    if (Array.isArray(this.data.userAnswer)) {
      this.data.userAnswer[index] = this.data.userAnswer[index] ^ 1; // Xor-operation to negate number
      this.toggleButtonToggled = true;
      this.disableCheckButton = false;
    } else {
      console.log('Can only toggle buttons!');
    }
  }

  setLevel(level: number) {
    this.current_level = level;
    this.trackSetLevel();
  }

  ensureArray(input: number | number[]) {
    if (Array.isArray(input)) {
      return input;
    } else {
      return [input];
    }
  }

  /**
   * Compares between the user answer in given index with the target answer.
   * @method isCorrectDigit
   * @param {Number} index - index of the toggle button
   * @returns {Boolean} if the user in the corresponding index equals to the target answer.
   */
  isCorrectDigit(index: number): boolean {
    const userAnswerArray = this.data.userAnswer as number[];
    const targetAnswerArray = this.data.targetAnswer as number[];
    return userAnswerArray[index] == targetAnswerArray[index];
  }

  /**
   * Lets the toggle buttons to be colored either green or red depending on the answer.
   * @method getButtonColor
   * @param {Number} index - the index of the toggle button.
   * @returns {Object}  An object that represent boolean values for the css to be displayed on the UI.
   */
  getButtonColor(index: number): { [key: string]: boolean } {
    if (this.checkBtnPressed) {
      if (
        this.data.result === undefined ||
        this.data.result === null ||
        this.data.currentTry <= 1
      ) {
        return {};
        //when the user tries for the third time, he will get in addition the modal_feedback,
        //colored toggle buttons that refers to correct and wrong answers.
      } else if (this.data.currentTry > 2) {
        return {
          'btn-success': this.isCorrectDigit(index),
          'btn-error': !this.isCorrectDigit(index),
        };
      }
    }
    return {};
  }

  /**
   * Enables check answer button, when the user starts to type the answer or clicks on the arows provided inside the inputfield.
   * @method onInputChange
   */
  onInputChange() {
    this.disableCheckButton = false;
  }
}
