import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { OverviewComponent } from './overview/overview.component';
import { AboutComponent } from './about/about.component';

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
    }
];
