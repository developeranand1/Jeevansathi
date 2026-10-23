import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { UserDashboardComponent } from './pages/user-dashboard/user-dashboard.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Jeevansathi Marriage - Leading Indian Matrimonial Service' },
  { path: 'login', component: LoginComponent, title: 'Login | Jeevansathi Marriage' },
  { path: 'register', component: RegisterComponent, title: 'Free Matrimonial Registration | Jeevansathi Marriage' },
  { path: 'dashboard', component: UserDashboardComponent, title: 'My Matrimonial Dashboard | Jeevansathi Marriage' },
  { path: '**', redirectTo: '' }
];
