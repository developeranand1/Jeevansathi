import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardLayoutComponent } from './pages/dashboard-layout/dashboard-layout.component';
import { DashboardHomeComponent } from './pages/dashboard-home/dashboard-home.component';
import { UsersPageComponent } from './pages/users/users.component';
import { KycPageComponent } from './pages/kyc/kyc.component';
import { PlansPageComponent } from './pages/plans/plans.component';
import { StaffPageComponent } from './pages/staff/staff.component';
import { KundliPageComponent } from './pages/kundli/kundli.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, title: 'Admin Login | Jeevansathi' },
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardHomeComponent, title: 'Dashboard | Jeevansathi Admin' },
      { path: 'users', component: UsersPageComponent, title: 'User Management | Jeevansathi Admin' },
      { path: 'kyc', component: KycPageComponent, title: 'KYC Moderation | Jeevansathi Admin' },
      { path: 'plans', component: PlansPageComponent, title: 'Subscription Plans | Jeevansathi Admin' },
      { path: 'staff', component: StaffPageComponent, title: 'Staff & Roles | Jeevansathi Admin' },
      { path: 'kundli', component: KundliPageComponent, title: 'Kundli Milan | Jeevansathi Admin' },
    ]
  },
  { path: '**', redirectTo: 'login' }
];
