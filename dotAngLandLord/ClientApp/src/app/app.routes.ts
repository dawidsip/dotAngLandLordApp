import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DetailsComponent } from './details/details.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [];

const routeConfig: Routes = [
    // {
    //   path: '',
    //   component: HomeComponent,
    //   title: 'Home page'
    // },
    {
      path: 'details/:id',
      component: DetailsComponent,
      title: 'Home details'
    },
    {
      path: 'dashboard',
      component: DashboardComponent,
      title: 'Users dashboard'
    }
  ];
  
  export default routeConfig;