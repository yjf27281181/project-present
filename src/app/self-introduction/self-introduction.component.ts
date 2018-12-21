import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../model/user.model';
import { ActivatedRoute } from '@angular/router';
import { UserService } from './user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-self-introduction',
  templateUrl: './self-introduction.component.html',
  styleUrls: ['./self-introduction.component.css']
})
export class SelfIntroductionComponent implements OnInit, OnDestroy {

  user: User;
  userInfoSub: Subscription;
  constructor(public router: ActivatedRoute, private userService: UserService) {}
  ngOnInit(): void {
    console.log('self introduction ini');
    this.userInfoSub = this.userService.getUserUpdatedListener().subscribe((userData) => {
      this.user = userData;
    });
  }

  ngOnDestroy(): void {
    this.userInfoSub.unsubscribe();
  }

}
