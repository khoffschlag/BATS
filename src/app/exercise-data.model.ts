export class ExerciseData {

    topic: string = '';

    title: string = '';
    task: string = '';

    userAnswer: number[] = Array(8).fill(0);
    targetAnswer: number[] = Array(8).fill(-1);
    
    result: boolean = false;
    feedback: string = '';
}