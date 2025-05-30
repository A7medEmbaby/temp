import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { authGuard } from './components/shared/guards/auth.guard';
import { loginGuard } from './components/shared/guards/login.guard';
import { ListServiceRequestsComponent } from './components/dashboard/service-requests/list-service-requests/list-service-requests.component';
import { ViewServiceRequestComponent } from './components/dashboard/service-requests/view-service-request/view-service-request.component';
import { ServiceRequestFormComponent } from './components/dashboard/service-requests/service-request-form/service-request-form.component';
import { SearchByIdComponent } from './components/dashboard/service-requests/search-by-id/search-by-id.component';
import { SearchByPhoneComponent } from './components/dashboard/service-requests/search-by-phone/search-by-phone.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard/service-requests', pathMatch: 'full' },
  { 
    path: 'login', 
    component: LoginComponent,
    canActivate: [loginGuard] // Add the login guard here
  },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'service-requests', pathMatch: 'full' },
      { path: 'service-requests', component: ListServiceRequestsComponent },
      { path: 'service-requests/new', component: ServiceRequestFormComponent },
      { path: 'service-requests/search-by-id', component: SearchByIdComponent },
      { path: 'service-requests/search-by-phone', component: SearchByPhoneComponent },
      { path: 'service-requests/:id', component: ViewServiceRequestComponent },
      { path: 'service-requests/:id/edit', component: ServiceRequestFormComponent },
      { path: 'service-requests/status', component: ListServiceRequestsComponent }
    ]
  },
  { path: '**', redirectTo: 'dashboard/service-requests' }
];