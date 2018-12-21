import { ProjectPart } from './project-part.model';

export class Project {
  _id: string;
  title: string;
  description: string;
  parts: ProjectPart[] | string;
  creatorId: string;
  coverImgUrl: string;
  createDate: string;
  keyWords: string[];
  size = 0;
}
