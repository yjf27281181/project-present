import { User } from '../model/user.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment} from '../../environments/environment';

const BACKEND_URL = environment.API_URL + 'user/';

@Injectable({ providedIn: 'root'})
export class AuthService {

  private token: string;
  private authStatusListener = new Subject<boolean>();
  private isAuthenticated = false;
  private username: string;
  private userId: string;
  private tokenTimer: any;


  constructor(private http: HttpClient, public router: Router) {}


  getToken() {
    return this.token;
  }

  getUsername() {
    return this.username;
  }

  getUserId() {
    return this.userId;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  uploadUser(userData: User) {
    console.log('upload user');

    this.http.post<{token: string}>(BACKEND_URL + 'signup', userData)
    .subscribe(response => {
      this.token = response.token;
      this.router.navigate(['/login']);
    }, error => {
      this.authStatusListener.next(false);
      console.log(error);
    });
  }

  updateUser(userData: User) {
    this.http.post<{username: string}>(BACKEND_URL + 'update', userData)
    .subscribe(response => {
      this.router.navigate(['/' + response.username]);
    }, error => {
      this.authStatusListener.next(false);
      console.log(error);
    });
  }

  login(username: string, password: string) {
    const authData = {username: username, password: password};
    this.http.post<{token: string, expiresIn: number, userId: string}>
    (BACKEND_URL + 'login', authData).subscribe(response => {
      this.token = response.token;
      const expiresInDuration = response.expiresIn;
      this.setAuthTimer(expiresInDuration * 1000);
      this.username = username;
      this.userId = response.userId;
      this.authStatusListener.next(true);
      this.isAuthenticated = true;
      this.saveAuthData(this.token,
        new Date(new Date().getTime() + expiresInDuration * 1000),
        this.username,
        this.userId);
      this.router.navigate(['project', username]);
    },
    error => {
      console.log(error);
      this.authStatusListener.next(false);
    });
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) { return; }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    console.log(expiresIn);
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.authStatusListener.next(true);
      this.username = authInformation.username;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn);
    }
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration);
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.username = null;
    this.router.navigate(['/']);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
  }

  private saveAuthData(token: string, expirationDate: Date, username: string, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expirationDate', expirationDate.toISOString());
    localStorage.setItem('username', username);
    localStorage.setItem('userId', userId);
  }

  getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expirationDate');
    const username = localStorage.getItem('username');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate || !username || !userId) {
      return;
    }

    return {
      token: token,
      expirationDate: new Date(expirationDate),
      username: username,
      userId: userId
    };
  }
}
