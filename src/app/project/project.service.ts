import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Project } from '../model/project.model';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment} from '../../environments/environment';
import { deepCopy } from '../tool/tool';
import { ProjectPart } from '../model/project-part.model';
import { SubTitle } from '../model/project-menu.mdoel';

const BACKEND_URL = environment.API_URL + 'project/';

@Injectable({ providedIn: 'root' })
export class ProjectService {

  private projectUpdated = new Subject<Project>();
  private projectsInfoUpdated = new Subject<Project[]>();
  private projectMenuUpdated = new Subject<SubTitle[]>();
  project: Project;

  constructor(private http: HttpClient, private router: Router) {}

  getProject(projectId: string) {
    // this.iniProject();
    return this.http.get<{message: string, project: Project}>(BACKEND_URL + projectId)
    .subscribe((data) => {
      this.project = data.project;
      this.project.parts = JSON.parse(this.project.parts as string);
      this.projectUpdated.next(deepCopy(data.project));
      this.projectMenuUpdated.next(deepCopy(this.getProjectTitles()));
    });

  }

  getProjectTitles() {

    if (!this.project)  {
      return null;
    }
    const subtitles = new Array<SubTitle>();
    let lastSub = new SubTitle();
    lastSub.content = this.project.title;
    subtitles.push(lastSub);
    const parts = this.project.parts as ProjectPart[];
    for (let i = 0; i < parts.length; i++) {
      if (parts[i].type === 'subtitle') {
        const subtitle = new SubTitle();
        subtitle.content = parts[i].content;
        subtitle.id = 'title' + i;
        subtitles.push(subtitle);
        lastSub = subtitle;
      }
      if (parts[i].type === 'subsubtitle') {
        if (!lastSub.subsubtitles) {
          lastSub.subsubtitles = new Array();
        }
        const subsub = {id: 'title' + i, content: parts[i].content};
        lastSub.subsubtitles.push(subsub);
      }
    }
    return subtitles;
  }

  getProjectUpdatedListener() {
    return this.projectUpdated;
  }

  getProjectsInfoUpdatedListener() {
    return this.projectsInfoUpdated;
  }

  getProjectMenuUpdated() {
    return this.projectMenuUpdated;
  }

  uploadImage(index: string, image: File) {
    const imageData = new FormData();
    imageData.append('index', index);
    imageData.append('image', image, image.name);
    return this.http.post<{index: string, url: string}>(BACKEND_URL + 'image', imageData);
  }

  uploadProject(project: Project) {
    project.parts = JSON.stringify(project.parts);
    return this.http.post<{projectId: string}>(BACKEND_URL + 'upload', project);
  }

  updateProject(project: Project) {
    project.parts = JSON.stringify(project.parts);
    return this.http.post<{projectId: string}>(BACKEND_URL + 'update', project);
  }

  getProjectsInformation(username: string) {
    return this.http.get<{projectsInfo: Project[]}>(BACKEND_URL + 'projectsInfo/' + username).subscribe(
      (data) => {
        console.log(data);
        this.projectsInfoUpdated.next(deepCopy(data.projectsInfo));
      }
    );
  }

  deleteProject(projectId: string) {
    return this.http.delete<{message: string}>(BACKEND_URL + 'project/' + projectId);
  }
  deleteImages(urls: string[]) {
    return this.http.request<{message: string}>('delete', BACKEND_URL + 'images', { body: urls }).subscribe(
      (result) => {
        console.log(result);
      }
    );
  }
}
