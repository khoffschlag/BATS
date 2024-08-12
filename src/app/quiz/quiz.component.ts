import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  ChangeDetectorRef,
} from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { ExerciseData } from '../exercise-data.model';
import { ApiService } from '../api.service';
import { UserLoggerService } from '../user-logger.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { routes } from '../app.routes';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, NgClass],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.css',
})
export class QuizComponent implements OnInit, OnDestroy {
  topic: string = '';
  data: ExerciseData = new ExerciseData();
  timer: number = 60;
  private intervalValue: any;
  disableCheckButton: boolean = true;
  toggleButtonToggled: boolean = false;
  checkBtnPressed: boolean = false;
  correctAnswerStreak: number = 0;
  modal1: any = document.getElementById('modal_no_record');

  isAuthenticated = false;

  current_level = 1;
  helpers = [128, 64, 32, 16, 8, 4, 2, 1]; // Only available when using level 1

  constructor(
    private api: ApiService,
    private behaviorLogger: UserLoggerService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.newExercise();
  }

  ngOnInit(): void {
    this.api.authStatus$.subscribe((isAuthenticated) => {
      this.isAuthenticated = isAuthenticated;
      this.cdr.detectChanges();
    });
    this.startTimer();
  }
  ngOnDestroy(): void {
    this.clearInerValue();
  }

  /**
   * Starts the timer for the quiz
   * @method startTimer
   */
  startTimer() {
    this.intervalValue = setInterval(() => {
      if (this.timer > 0) {
        this.timer--;
      } else {
        this.clearInerValue();
        this.finishingQuiz();
      }
    }, 1000);
  }

  /**
   * Stops and resets the timer value.
   * @method clearInerValue
   */
  clearInerValue(): void {
    if (this.intervalValue) {
      clearInterval(this.intervalValue);
      this.intervalValue = null;
    }
  }

  setLevel(level: number) {
    this.current_level = level;
    //this.trackSetLevel();
  }

  ensureArray(input: number | number[]) {
    if (Array.isArray(input)) {
      return input;
    } else {
      return [input];
    }
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

  newExercise() {
    this.data = new ExerciseData();

    if (this.data.topic == 'decimalConversion') {
      this.data.userAnswer = 0;
      this.data.targetAnswer = -1;
    }

    this.api.getQuiz().subscribe((response) => {
      // getQuiz instead of getExercise and we don't pass any data to API
      this.data.topic = (response as any).topic;
      this.data.title = (response as any).title;
      this.data.task = (response as any).task;
      this.data.targetAnswer = (response as any).targetAnswer;

      if (this.data.topic == 'decimalConversion') {
        this.data.userAnswer = 0;
      }
    });
    //this.trackButtonNextExerciseClick()
  }

  checkAnswer() {
    this.checkBtnPressed = true;
    this.api.checkExercise(this.data).subscribe((response) => {
      this.data.result = (response as any).result;
      this.data.feedback = (response as any).feedback;

      if (this.data.result) {
        this.correctAnswerStreak += 1;
        this.disableCheckButton = true;
        this.checkBtnPressed = false;
        this.newExercise();
        this.timer = 60;
      } else {
        this.disableCheckButton = true;
      }
    });
    //this.trackButtonCheckClick();
  }

  /**
   * Stores the value of correctAnswerStreak in the browser local storage, to be retrieved in auth component.
   * @method storeCorrectAnswerStreak
   */
  storeCorrectAnswerStreak() {
    localStorage.setItem(
      'correctAnswerStreak',
      this.correctAnswerStreak.toString()
    );
  }

  /**
   * Updates the streak in the database, then redirects the user to the leaderboard.
   * @method updateStreakInDB
   */
  updateStreakInDB() {
    this.api.updateStreak(this.correctAnswerStreak).subscribe();
    this.goToLeaderboard();
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
      if (this.data.result === undefined || this.data.result === null) {
        return {};
      } else {
        return {
          'btn-success': this.isCorrectDigit(index),
          'btn-error': !this.isCorrectDigit(index),
        };
      }
    }
    return {};
  }

  /**
   * Handles closing modal_no_record.
   * @method onCloseButtonClick
   */
  onCloseButtonClick() {
    if (this.modal1) {
      this.modal1.close();
    }
  }

  /**
   * Enables check answer button, when the user starts to type the answer or clicks on the arows provided inside the inputfield.
   * @method onInputChange
   */
  onInputChange() {
    this.disableCheckButton = false;
  }

  /**
   * Terminate the quiz.
   * @method finishingQuiz
   */
  finishingQuiz() {
    this.clearInerValue();
    this.storeCorrectAnswerStreak();

    let modalShow: any;

    //if the user is already logged in and did the quiz, retrieve his old streak value from the database
    //and compare it with the new one, if the condition is met the new streak value is stored.
    if (this.isAuthenticated) {
      const currentRecordsubscription = this.api.checkUserStreak().subscribe({
        next: (streak) => {
          const currentRecord: number = streak;
          if (this.correctAnswerStreak > currentRecord) {
            modalShow = document.getElementById('modal_auth_ok');
          } else {
            modalShow = document.getElementById('modal_no_record');
          }
          if (modalShow) {
            modalShow.showModal();
          }
        },
        error: (err) => {
          console.error('Error checking streak:', err);
        },
      });
    } else {
      //if the user is not logged in, he can choose either to register, log in or to go back.
      modalShow = document.getElementById('modal_leave_or_register');
    }
    if (modalShow) {
      modalShow.showModal();
    }
  }

  //redirect to overview component.
  goToOverview() {
    this.router.navigate(['/overview']);
  }

  //redirect to auth component.
  goToLogin() {
    this.router.navigate(['/auth']);
  }

  //redirect to leaderboard component.
  goToLeaderboard() {
    this.router.navigate(['/leaderboard']);
  }
}
