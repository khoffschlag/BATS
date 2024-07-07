export class ExerciseData {

    topic: string = '';

    title: string = '';
    task: string = '';

    userAnswer: number | number[] = Array(8).fill(0);
    targetAnswer: number | number[] = Array(8).fill(-1);
    currentTry: number = 0;
    
    result: boolean = false;
    feedback: string = '';
}