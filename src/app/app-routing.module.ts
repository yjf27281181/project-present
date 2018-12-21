import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectListComponent } from './project/project-list/project-list.component';
import { ProjectDetailComponent } from './project/project-detail/project-detail.component';
import { ProjectCreateComponent } from './project/project-create/project-create.component';
import { ProjectComponent } from './project/project.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'project/admin', pathMatch: 'full' },
  { path: 'create', component: ProjectCreateComponent, canActivate: [AuthGuard]},
  { path: 'modify/:projectId', component: ProjectCreateComponent, canActivate: [AuthGuard]},
  { path: 'login', component: LoginComponent},
  { path: 'signup', component: SignupComponent},
  { path: 'project', component: ProjectComponent,
    children: [
      { path: 'updateUser', component: SignupComponent, canActivate: [AuthGuard]},
      { path: ':username', component: ProjectListComponent},
      { path: ':username/:projectId', component: ProjectDetailComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
