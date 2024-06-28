import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { OverviewComponent } from './overview/overview.component';
import { AboutComponent } from './about/about.component';
import { TheoryComponent } from './theory/theory.component';
import { ExerciseComponent } from './exercise/exercise.component';

export const routes: Routes = [
    {
        path: "",
        component: HomeComponent,
        title: "Home"
    },
    {
        path: "overview",
        component: OverviewComponent,
        title: "Overview"
    },
    {
        path: "about",
        component: AboutComponent,
        title: "About us"
    },
    {
        path: "overview/theory/:topic",
        component: TheoryComponent,
        title: "Theory"
    },
    {
        path:"overview/theory/:topic",children:[
            {
                path: "exercise/:topic",
                component: ExerciseComponent,
                title: "Exercise"
            }
        ]
    },
    {
        path: "overview/exercise/:topic",
        component: ExerciseComponent,
        title: "Exercise"
    }
];
