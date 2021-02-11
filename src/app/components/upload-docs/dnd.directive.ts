import { Directive, Output, Input, EventEmitter, HostBinding, HostListener } from '@angular/core';
  

// https://medium.com/@tarekabdelkhalek/how-to-create-a-drag-and-drop-file-uploading-in-angular-78d9eba0b854

  @Directive({
    selector: '[appDnd]'
  })
  export class DndDirective {

    constructor() {
        this.fileOver = false;
    }  

    @HostBinding('class.fileover') fileOver: boolean;
    @Output() fileDropped = new EventEmitter<any>();
  
    // Dragover listener
    @HostListener('dragover', ['$event']) onDragOver(evt : DragEvent) {
      evt.preventDefault();
      evt.stopPropagation();
      this.fileOver = true;
    }
  
    // Dragleave listener
    @HostListener('dragleave', ['$event']) public onDragLeave(evt : DragEvent) {
      evt.preventDefault();
      evt.stopPropagation();
      this.fileOver = false;
    }
  
    // Drop listener
    @HostListener('drop', ['$event']) public ondrop(evt : DragEvent) {
      evt.preventDefault();
      evt.stopPropagation();
      this.fileOver = false;
      if (evt.dataTransfer) {
        let files = evt.dataTransfer.files;
        if (files.length > 0) {
          this.fileDropped.emit(files);
        }
      }
    }
  }