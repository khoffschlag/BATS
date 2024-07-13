import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { OverviewComponent } from './overview/overview.component';
import { AboutComponent } from './about/about.component';
import { TheoryComponent } from './theory/theory.component';
import { ExerciseComponent } from './exercise/exercise.component';
import { QuizComponent } from './quiz/quiz.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';
import { AuthComponent } from './auth/auth.component';

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
        path: "overview", children:[
            {
                path:"quiz",
                component: QuizComponent,
                title: "Quiz"
            }
        ]
    },
    {
        path:"overview/quiz", children:[
            {
                path:"dashboard",
                component: DashboardComponent,
                title: "Dashboard",
                canActivate: [authGuard]
            }
        ]
    },
    {
        path: "dashboard",
        component: DashboardComponent,
        title:"Dashboard",
        canActivate: [authGuard]
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
    },
    {
        path: "auth",
        component: AuthComponent,
        title: "Authentication"
    },
    // Wildcard route
    {
        path: '**',
        component: HomeComponent,
    },
];
