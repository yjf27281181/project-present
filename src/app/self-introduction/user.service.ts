import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment} from '../../environments/environment';
import { User } from '../model/user.model';
import { Subject, Subscription } from 'rxjs';
import { deepCopy } from '../tool/tool';
import { Project } from '../model/project.model';

const BACKEND_URL = environment.API_URL + 'user/';

@Injectable({ providedIn: 'root'})
export class UserService {
  private userInfoUpdated = new Subject<User>();
  constructor(private http: HttpClient, public router: Router) {}

  user: User;

  getUser() {
    return this.user;
  }

  getUserUpdatedListener() {
    return this.userInfoUpdated;
  }

  getUserInformation(username: string) {
    return this.http.get<{user: User}>(BACKEND_URL + username).subscribe(
      (userData) => {
        this.user = userData.user[0];
        const copyUser = deepCopy(this.user);
        this.userInfoUpdated.next(copyUser);
      }
    );
  }
}
