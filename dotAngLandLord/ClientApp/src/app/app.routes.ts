import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { DetailsComponent } from './components/details/details.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AboutComponent } from './components/about/about.component';

export const routes: Routes = [];

const routeConfig: Routes = [
    {
      path: '',
      component: HomeComponent,
      title: 'Home page'
    },
    {
      path: 'details/:id',
      component: DetailsComponent,
      title: 'Home details'
    },
    {
      path: 'dashboard',
      component: DashboardComponent,
      title: 'Users dashboard'
    },
    {
      path: 'about',
      component: AboutComponent,
      title: 'About apps author'
    }
  ];
  
  export default routeConfig;