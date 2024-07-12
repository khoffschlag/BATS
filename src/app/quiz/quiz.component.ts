import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
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
  imports: [RouterLink, CommonModule, FormsModule,NgClass],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.css'
})
export class QuizComponent implements OnInit , OnDestroy {

  topic: string = '';
  data: ExerciseData = new ExerciseData();
  timer: number = 30;
  private intervalValue: any;
  disableCheckButton: boolean = true;
  toggleButtonToggled: boolean = false;
  checkBtnPressed:boolean=false;
  correctAnswerStreak: number = 0;
  modal1: any = document.getElementById('my_modal_1');
  modal2 : any = document.getElementById('my_modal_2');
  
  isAuthenticated = false;

  current_level = 1;
  helpers = [128, 64, 32, 16, 8, 4, 2, 1];  // Only available when using level 1

  constructor(private api: ApiService, 
              private behaviorLogger: UserLoggerService, 
              private router: Router,
              private cdr: ChangeDetectorRef) {
    this.newExercise();

  }

  ngOnInit(): void {
      this.api.authStatus$.subscribe(
        (isAuthenticated) => {
          this.isAuthenticated = isAuthenticated;
          this.cdr.detectChanges(); 
        }
      );
      this.startTimer();
  }
  ngOnDestroy(): void {
      this.clearInerValue();
  }
  startTimer(){
    const modal1: any = document.getElementById('my_modal_1');
    this.intervalValue = setInterval(() => {
      if(this.timer > 0){
        this.timer--;
      }
      else{
        this.clearInerValue();
        if(modal1)
        {
          modal1.showModal();
        }
      }
    },1000);
  }

  clearInerValue(): void{
    if(this.intervalValue){
      clearInterval(this.intervalValue);
      this.intervalValue = null;
    }

  }
  setLevel(level: number) {
    this.current_level = level;
    //this.trackSetLevel();
  }
  ensureArray(input : number | number[]) {
    if (Array.isArray(input)) {
      return input;
    }
    else {
      return [input];
    }
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
      this.toggleButtonToggled = true;
      this.disableCheckButton = false;
    }
    else {
      console.log('Can only toggle buttons!');
    }
  }
  newExercise() {
    this.data = new ExerciseData();

    if (this.data.topic == 'decimalConversion') {
      this.data.userAnswer = 0;
      this.data.targetAnswer = -1;
    }

    this.api.getQuiz().subscribe(response => { // getQuiz instead of getExercise and we don't pass any data to API
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
    this.checkBtnPressed=true;
    this.api.checkExercise(this.data).subscribe(response => {
      this.data.result = (response as any).result;
      this.data.feedback = (response as any).feedback;

      if (this.data.result) {
        this.correctAnswerStreak += 1;
        this.data.currentTry = 0;
        this.disableCheckButton = true;
        this.checkBtnPressed = false;
        this.newExercise();
        this.timer = 30;
      } else {
        this.correctAnswerStreak = 0;
        this.disableCheckButton = true;
        this.data.currentTry += 1;
      }
    })
    //this.trackButtonCheckClick();

}
//storing the value of correctAnswerStreak in the browser local storage, to retrieve it in auth component
storeCorrectAnswerStreak() {
  localStorage.setItem('correctAnswerStreak', this.correctAnswerStreak.toString());
}

updateStreakInDB() {
  this.api.updateStreak(this.correctAnswerStreak);
}

isCorrectDigit(index: number): boolean {
  const userAnswerArray = this.data.userAnswer as number[];
  const targetAnswerArray = this.data.targetAnswer as number[];
  return userAnswerArray[index] == targetAnswerArray[index];
}

getButtonColor(index: number): { [key: string]: boolean } {
  if (this.checkBtnPressed) {
    if(this.data.result === undefined || this.data.result === null) 
      {
    return {};
      }
  else {
  return {
    'btn-success': this.isCorrectDigit(index),
    'btn-error': !this.isCorrectDigit(index)
  };
}
}
  return {};
}
onCloseButtonClick(){
  if(this.modal1)
  {
    this.modal1.close();
  }
}

onInputFocus(){
  this.disableCheckButton = false;
}

finishingQuiz(){
  this.clearInerValue();
  this.storeCorrectAnswerStreak();

  let modal_show: any;
  if (this.isAuthenticated) {
    const currentRecordsubscription = this.api.checkUserStreak().subscribe({
      next: (streak) => {
        const currentRecord: number = streak;
        if (this.correctAnswerStreak > currentRecord) {
          modal_show = document.getElementById('modal_auth_ok');
        }else {
          modal_show = document.getElementById('modal_no_record');
        }
      }
    });

  }else {
     modal_show = document.getElementById('my_modal_2');
  }
  if(modal_show)
  {
    modal_show.showModal();
  }
}

goToOverview() {
  this.router.navigate(['/overview']);
}

goToLogin(){ 
  localStorage.setItem('quizResults', JSON.stringify(this.correctAnswerStreak));
  this.router.navigate(['/auth']);
}

goToDashboard(){
  this.router.navigate(['/dashboard']);
}

}


