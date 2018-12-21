import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { User } from 'src/app/model/user.model';
import { AuthService } from '../auth.service';
import { UserService } from 'src/app/self-introduction/user.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  selector: 'app-signup'
})
export class SignupComponent implements OnInit, OnDestroy {
  validateForm: FormGroup;
  userUpdatedSub = new Subscription();
  mode = 'create';
  skills = new Array<string>();

  constructor(private fb: FormBuilder, private authService: AuthService,
    private userService: UserService, public router: Router) {}

  ngOnInit(): void {
    console.log('signup');
    this.validateForm = this.fb.group({
      username         : [ null, [ Validators.required ] ],
      firstName      : [ null  ],
      lastName      : [ null  ],
      email            : [ null, [ Validators.email ] ],
      phoneNumberPrefix: [ null  ],
      phoneNumber      : [ null  ],
      currentSchool      : [ null  ],
      currentMajor      : [ null  ],
      location          : [ null ],
      selfIntroduction   : [ null ],
      agree            : [ false, [ Validators.requiredTrue]]
    });

    if (this.authService.getIsAuth()) {
      this.mode = 'update';
      this.userUpdatedSub = this.userService.getUserUpdatedListener().subscribe((user) => {
        this.iniUserInfo(user);
      });
      this.userService.getUserInformation(this.authService.getUsername());
    } else {
      this.validateForm.addControl('password',
        new FormControl(null, {validators: Validators.required}));
      this.validateForm.addControl('checkPassword',
        new FormControl(null, {validators: [ Validators.required, this.confirmationValidator ]}));
    }
  }

  iniUserInfo(user: User) {
    this.validateForm.controls[ 'username' ].setValue(user.username);
    this.validateForm.controls[ 'firstName' ].setValue(user.firstName);
    this.validateForm.controls[ 'lastName' ].setValue(user.lastName);
    this.validateForm.controls[ 'email' ].setValue(user.email);
    this.validateForm.controls[ 'phoneNumber' ].setValue(user.phoneNumber);
    this.validateForm.controls[ 'currentSchool' ].setValue(user.currentSchool);
    this.validateForm.controls[ 'currentMajor' ].setValue(user.currentMajor);
    this.validateForm.controls[ 'location' ].setValue(user.location);
    this.validateForm.controls[ 'selfIntroduction' ].setValue(user.selfIntroduction);
    this.skills = user.skills;
  }

  confirmationValidator = (control: FormControl): { [ s: string ]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
  }

  onTagChanged(tags) {
    this.skills = tags;
  }
  submitForm(): void {

    // tslint:disable-next-line:forin
    for (const i in this.validateForm.controls) {
      if (this.mode !== 'update' || (i !== 'password' && i !== 'checkPassword')) {
        this.validateForm.controls[ i ].markAsDirty();
        this.validateForm.controls[ i ].updateValueAndValidity();
      }
    }

    if (!this.validateForm.valid) {
      return;
    }
    const user = new User();
    user.username = this.validateForm.controls[ 'username' ].value;
    if (this.mode === 'create') {
      user.password = this.validateForm.controls[ 'password' ].value;
    }
    user.firstName = this.validateForm.controls[ 'firstName' ].value;
    user.lastName = this.validateForm.controls[ 'lastName' ].value;
    user.email = this.validateForm.controls[ 'email' ].value;
    user.phoneNumber = this.validateForm.controls[ 'phoneNumber' ].value;
    user.currentMajor = this.validateForm.controls[ 'currentMajor' ].value;
    user.currentSchool = this.validateForm.controls[ 'currentSchool' ].value;
    user.location = this.validateForm.controls[ 'location' ].value;
    user.selfIntroduction = this.validateForm.controls[ 'selfIntroduction' ].value;
    user.skills = this.skills;
    console.log(this.mode);
    if (this.mode === 'create') {
      this.authService.uploadUser(user);
      this.router.navigate(['/login']);
    } else {
      console.log('update user');
      this.authService.updateUser(user);
      this.router.navigate(['/project/' + user.username]);
    }

  }

  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => this.validateForm.controls.checkPassword.updateValueAndValidity());
  }

  ngOnDestroy(): void {
    this.userUpdatedSub.unsubscribe();
  }
}
