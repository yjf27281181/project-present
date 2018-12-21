import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { Project } from 'src/app/model/project.model';
import { ProjectPart } from 'src/app/model/project-part.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { mimeType } from './mime-type.validator';
import { ProjectService } from '../project.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';
import { ParamMap, ActivatedRoute, Router } from '@angular/router';
import { deepCopy } from 'src/app/tool/tool';


class Control {
  strId: string;
  type: string;
  imagePreview: string | ArrayBuffer;
  fileName: string;
  fileSize = 0;
  constructor(strId: string, type: string) {
    this.strId = strId;
    this.type = type;
  }
}


@Component({
  templateUrl: './project-create.component.html',
  styleUrls: ['./project-create.component.css'],
  selector: 'app-project-create'
})
export class ProjectCreateComponent implements OnInit, OnDestroy {

  oldProject: Project;
  form: FormGroup;
  currentId: number;
  controlArray: Array<Control> = [];
  coverPreview: string | ArrayBuffer;
  imgNum = 0;
  mode = 'create';
  projectUpdatedSub: Subscription;
  deleteUrls: Array<string> = [];
  keyWords: Array<string> = [];

  constructor(public element: ElementRef, private projectService: ProjectService,
    private authService: AuthService, public activatedRouter: ActivatedRoute,
    private router: Router) {}
  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      description: new FormControl(null, {validators: [Validators.required, Validators.maxLength(140)]}),
      coverImg: new FormControl(null, {})
    });
    this.currentId = -1;
    let projectId = '';

    // update
    this.activatedRouter.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('projectId')) {
        projectId = paramMap.get('projectId');
        this.mode = 'update';
      } else {
        return;
      }
      this.projectUpdatedSub = this.projectService.getProjectUpdatedListener()
      .subscribe((project) => {
        this.iniProjectContent(project);
      });
      this.projectService.getProject(projectId);
    });

    // create
    if (this.mode === 'create') {
      this.addField('subtitle', 0);
    }
  }

  iniProjectContent(project: Project) {
    console.log(project);
    this.oldProject = project;
    this.oldProject.parts = project.parts as ProjectPart[];
    this.coverPreview = project.coverImgUrl;
    this.keyWords = project.keyWords;
    this.form.controls[ 'title' ].setValue(project.title);
    this.form.controls[ 'description' ].setValue(project.description);
    const parts = this.oldProject.parts;
    // tslint:disable-next-line:forin
    for (let i = 0; i < parts.length; i++) {
      this.addField(parts[i].type, i);
      if (parts[i].type === 'image') {
        const tmpUrl = parts[i].url;
        const tmpArray = tmpUrl.split('-');
        this.controlArray[i].imagePreview = tmpUrl;
        this.controlArray[i].fileName = tmpArray[tmpArray.length - 1];
      } else {
        this.form.controls[ String(this.currentId) ].setValue(parts[i].content);
      }

    }
  }

  addField(type: string, index: number, e?: MouseEvent): Control {
    if (e) {
      e.preventDefault();
    }

    const strId = String(++this.currentId);
    const control = new Control(strId, type);
    if (type === 'image') {
      this.form.addControl(control.strId,
        new FormControl(null, {}));
        // new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]}));
    } else {
      this.form.addControl(control.strId, new FormControl(null, Validators.required));
    }
    this.controlArray.splice(index + 1, 0, control);
    return control;
  }

  removeField(control: Control, e: MouseEvent): void {
    if (e) { e.preventDefault(); }
    if (control.type === 'image' && this.form.controls[control.strId].value) {
      this.imgNum--; // if the delete type is image, and image is not null;
    }

    if (control.type === 'image' && typeof(control.imagePreview) === 'string') {
      this.deleteUrls.push(control.imagePreview);
    }

    if (this.controlArray.length > 1) {
      const index = this.controlArray.indexOf(control);
      this.controlArray.splice(index, 1);
      console.log(this.controlArray);
      this.form.removeControl(control.strId);
    }
  }

  onImagePicked(index: number, event: Event) {
    if (event) {
      event.preventDefault();
    }
    const file = (event.target as HTMLInputElement).files[0];
    let control;
    if (index === -1) {  // this img is the cover
      if ( typeof this.coverPreview === 'string' ) {
        this.deleteUrls.push(this.coverPreview);
      }
      this.form.get('coverImg').updateValueAndValidity();
      this.form.patchValue({coverImg: file});
    } else {
      control = this.addField('image', index);
      control.fileName = file.name;
      control.fileSize = file.size;
      this.form.get(control.strId).updateValueAndValidity();
      const obj = {};
      obj[control.strId] = file;
      this.form.patchValue(obj);
    }
    const reader = new FileReader();
    reader.onload = () => {
      this.imgNum++;                         // count imgs
      if (index === -1) {
        this.coverPreview = reader.result;
      }
    };
    reader.readAsDataURL(file);
  }

  onUploadProject() {

    // tslint:disable-next-line:forin
    // for (const i in this.form.controls) {
    //   this.form.controls[ i ].markAsDirty();
    //   this.form.controls[ i ].updateValueAndValidity();
    // }


    this.projectService.deleteImages(this.deleteUrls);
    if (!this.oldProject) {
      this.oldProject = new Project();
    }
    const project = deepCopy(this.oldProject);

    project.parts = new Array<ProjectPart>();
    project.keyWords = this.keyWords;
    let imgNum = this.imgNum;

    project.title = this.form.controls[ 'title' ].value;
    project.description = this.form.controls[ 'description' ].value;
    if (this.mode === 'create') {
      project.creatorId = this.authService.getUserId();
    }

    const coverFile = this.form.controls['coverImg'].value;
    if (coverFile) {
      this.projectService.uploadImage('-1', coverFile).subscribe((data) => {
        imgNum--;
        project.coverImgUrl = data.url;
        if (imgNum === 0) {
          this.uploadProjectFromService(project);
        }
      });
    } else {
      project.coverImgUrl = this.coverPreview as string;
    }

    // tslint:disable-next-line:forin
    for (let i = 0; i < this.controlArray.length; i++) {
      const control = this.controlArray[i];
      project.projectSize += control.fileSize;
      const part = new ProjectPart();
      part.type = control.type;
      if (control.type !== 'image') {
        part.content = this.form.controls[control.strId].value;
      } else {
        console.log('upload image');
        const file = this.form.controls[control.strId].value;
        if (file) {
          this.projectService.uploadImage(String(i), file).subscribe((data) => {
            imgNum--;
            console.log(project.parts);
            project.parts[data.index]['url'] = data.url;
            if (imgNum === 0) {
              this.uploadProjectFromService(project);
            }
          });
        } else {
          part['url'] = control.imagePreview as string;
        }
      }
      (project.parts as ProjectPart[]).push(part);
    }
    if (imgNum === 0) {
      this.uploadProjectFromService(project);
    }
  }

  uploadProjectFromService(project: Project) {
    if (this.mode === 'create') {
      this.projectService.uploadProject(project).subscribe((projectId) => {
        this.router.navigate(['project/' + this.authService.getUsername()]);
      });
    } else {
      this.projectService.updateProject(project).subscribe((projectId) => {
        this.router.navigate(['project/' + this.authService.getUsername()]);
      });
    }
  }

  ngOnDestroy(): void {
    if (this.projectUpdatedSub) {
      this.projectUpdatedSub.unsubscribe();
    }
  }

  isString(s) {
    return typeof s === 'string';
  }

  onTagChanged(keyWords) {
    this.keyWords = keyWords;
  }
}
