import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProjectService } from '../project.service';
import { Project } from 'src/app/model/project.model';
import { Subscription } from 'rxjs';
import { SubTitle } from 'src/app/model/project-menu.mdoel';
@Component({
  templateUrl: './project-menu.component.html',
  styleUrls: ['./project-menu.component.css'],
  selector: 'app-project-menu'
})
export class ProjectMenuComponent implements OnInit, OnDestroy {

  private projectMenuSub;

  constructor(private projectService: ProjectService) {}
  project: Project;
  isLoding = false;

  subtitles: SubTitle[];

  ngOnInit(): void {
    this.projectMenuSub = this.projectService.getProjectMenuUpdated().subscribe((projectMenu) => {
      this.subtitles = projectMenu;
      console.log(this.subtitles);
    });
  }
  ngOnDestroy(): void {
    this.projectMenuSub.unsubscribe();
  }
}
