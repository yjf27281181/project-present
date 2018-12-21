import { Component, OnInit, OnDestroy } from '@angular/core';
import { ParamMap, ActivatedRoute} from '@angular/router';
import { Project } from 'src/app/model/project.model';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/self-introduction/user.service';
import { ProjectService } from '../project.service';
import { User } from 'src/app/model/user.model';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css'],
  selector: 'app-project-list'
})
export class ProjectListComponent implements OnInit, OnDestroy {
  loading = true;
  projectsInfo = new Array<Project>();
  projectsInfoListener: Subscription;
  userInfoListener: Subscription;
  user: User;
  constructor(private activatedRouter: ActivatedRoute, private userService: UserService,
    private projectService: ProjectService, public authService: AuthService) {}

  ngOnInit(): void {
    this.projectsInfoListener = this.projectService.getProjectsInfoUpdatedListener()
    .subscribe((projects) => {
      this.loading = false;
      this.projectsInfo = projects;
    });
    this.userInfoListener = this.userService.getUserUpdatedListener()
    .subscribe((user) => {
      this.user = user;
    });
    let username = '';
    this.activatedRouter.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('username')) {
        username = paramMap.get('username');
      }
    });
    console.log('project-detail init' + username);
    this.userService.getUserInformation(username);
    this.projectService.getProjectsInformation(username);
  }

  onDeleteProject(projectId: string) {
    this.projectService.deleteProject(projectId).subscribe(
      (result) => {
        console.log(result);
      }
    );
    window.location.reload();
  }

  ngOnDestroy(): void {
    this.projectsInfoListener.unsubscribe();
  }
}
