import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { ProjectListComponent } from './project/project-list/project-list.component';
import { SelfIntroductionComponent } from './self-introduction/self-introduction.component';
import { ProjectDetailComponent } from './project/project-detail/project-detail.component';
import { ProjectMenuComponent } from './project/project-menu/project-menu.component';
import { ProjectCreateComponent } from './project/project-create/project-create.component';
import { LoginComponent } from './auth/login/login.component';
import { ProjectComponent } from './project/project.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthInterceptor } from './auth/auth-intercepter';
import { AuthGuard } from './auth/auth.guard';
import { TagComponent } from './tool/tag/tag.component';
import { FooterComponent } from './footer/footer.component';

registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ProjectListComponent,
    SelfIntroductionComponent,
    ProjectDetailComponent,
    ProjectMenuComponent,
    ProjectCreateComponent,
    ProjectComponent,
    LoginComponent,
    SignupComponent,
    TagComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    NgZorroAntdModule,
    ReactiveFormsModule
  ],
  providers: [ { provide: NZ_I18N, useValue: zh_CN },
    AuthGuard,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
