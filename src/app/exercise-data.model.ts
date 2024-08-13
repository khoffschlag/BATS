export class ExerciseData {
  topic: string = '';

  title: string = '';
  task: string = '';

  // answer is of type number if answer is decimal number, if answer is binary number then it's of type number[]
  userAnswer: number | number[] = Array(8).fill(0);
  targetAnswer: number | number[] = Array(8).fill(-1);
  currentTry: number = 0;

  result: boolean = false;
  feedback: string = '';
}
