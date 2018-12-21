import { Component, ElementRef, ViewChild, Input, Output, EventEmitter} from '@angular/core';


@Component({
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.css'],
  selector: 'app-tag'
})
export class TagComponent {
  @Input() tags: string[];
  @Input() isEditable: boolean;
  @Output() getTagsChanged = new EventEmitter<string[]>();
  @ViewChild('inputElement') inputElement: ElementRef;

  inputVisible = false;
  inputValue = '';

  handleClose(removedTag: {}): void {
    this.tags = this.tags.filter(tag => tag !== removedTag);
    this.getTagsChanged.emit(this.tags);
    console.log(this.tags);
  }

  sliceTagName(tag: string): string {
    const isLongTag = tag.length > 20;
    return isLongTag ? `${tag.slice(0, 20)}...` : tag;
  }

  showInput(): void {
    this.inputVisible = true;
    setTimeout(() => {
      this.inputElement.nativeElement.focus();
    }, 10);
  }

  handleInputConfirm(): void {
    if (this.inputValue && this.tags.indexOf(this.inputValue) === -1) {
      this.tags.push(this.inputValue);
      this.getTagsChanged.emit(this.tags);
      console.log(this.tags);
    }
    this.inputValue = '';
    this.inputVisible = false;
  }

}
