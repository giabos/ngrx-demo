import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DocumentType, UploadDocumentsService } from './UploadDocuments.service';

interface FileToUpload {
  name: string;
  progress: number; // % (0-100)
  size: number;  // in KB
  done: boolean;
  inError: boolean,
}

const bToKb = (bytes: number) : number => Math.ceil(bytes/1024);
const percent = (n: number, total: number) : number => Math.ceil((n/total)*100);

@Component({
  selector: 'upload-area',
  templateUrl: './UploadArea.component.html',
  styleUrls: ['./UploadArea.component.scss']
})
export class UploadAreaComponent {

  @Input()
  title: string = "title here";

  @Input()
  documentType: DocumentType = DocumentType.IdDocument;

  @Input()
  id: string = "upload-zone";

  @ViewChild('fileUploadRef') fileInput : ElementRef | undefined; 

  files: FileToUpload[];

   constructor(private uploadDocumentsService : UploadDocumentsService) {
    this.files = [];
  }

  uploadFiles (filesToUpload : File[]) {
    console.log("File upload", Array.from(filesToUpload).map(a => a.name));
    this.files = Array.from(filesToUpload).map(a => ({name: a.name, done: false, progress: 0, size: bToKb(a.size), inError: false }));
    this.uploadDocumentsService.uploadDocuments(this.documentType, filesToUpload, (idx, uploaded) => {
      console.log("uploaded", idx, uploaded)
      const file = this.files[idx];
      const uploadedKb = bToKb(uploaded);
      file.progress = percent(uploadedKb, file.size);
    }, idx => {
      const file = this.files[idx];
      file.progress = 100;
      file.done = true;
    }, (idx, errMsg) => {
      const file = this.files[idx];
      file.inError = true;
      file.done = true;
      console.error(errMsg);
    });
  }

  onDrop (evt : File[]) {
    this.uploadFiles(evt);
  }

  onSelectedFiles (evt : any) {
    this.uploadFiles(Array.from(evt.target.files));
  }
  
  onOpenFileSelector (event : Event) {
    event.preventDefault();
    const input = this.fileInput?.nativeElement;
    input.click();
  }

  onFileRemove(fileName: string) {
    this.uploadDocumentsService.removeDocument(this.documentType, fileName)
      .subscribe(() => {
        this.files = this.files.filter(a => a.name != fileName);
      });
  }



}
