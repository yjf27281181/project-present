import { Component, OnInit, OnDestroy } from '@angular/core';
import { Project } from 'src/app/model/project.model';
import { Subscription } from 'rxjs';
import { ProjectService } from '../project.service';
import { ParamMap, Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/self-introduction/user.service';

@Component({
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css'],
  selector: 'app-project-detail'
})
export class ProjectDetailComponent implements OnInit, OnDestroy {

  constructor(public router: ActivatedRoute, private projectService: ProjectService,
    private userService: UserService) {}

  project: Project;
  projectSub: Subscription;
  ngOnInit(): void {
    this.projectSub = this.projectService.getProjectUpdatedListener().subscribe((projectData) => {
      this.project = projectData;
    });
    let projectId = '';
    let username = '';
    console.log(this.router.paramMap);
    this.router.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('projectId')) {
        projectId = paramMap.get('projectId');
        username = paramMap.get('username');
      }
      this.projectService.getProject(projectId);
      this.userService.getUserInformation(username);
    });
  }

  ngOnDestroy(): void {
    this.projectSub.unsubscribe();
  }


}
