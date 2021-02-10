import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Observable, of } from 'rxjs';
import { UploadDocumentsService } from './UploadDocuments.service';

interface File {
  name: string;
  uploaded: boolean;
  progress: number; // % (0-100)
  size: number;  // in KB

}


@Component({
  selector: 'upload-area',
  templateUrl: './UploadArea.component.html',
  styleUrls: ['./UploadArea.component.scss']
})
export class UploadAreaComponent implements OnInit {

  @Input()
  title: string = "title here";

  @Input()
  id: string = "upload-zone";

  @ViewChild('fileUploadRef') fileInput : ElementRef | undefined; 

  files: Observable<File[]>;

   constructor(private uploadDocumentsService : UploadDocumentsService) {
    this.files = of([{
      name: "abdef.pdf",
      uploaded: false,
      progress: 20,
      size: 333,
    },
    {
      name: "aerazerazerazeraz.pdf",
      uploaded: true,
      progress: 74,
      size: 333,
    },
    ]);
  }

  ngOnInit(): void {
  }


  uploadFiles (files : File[]) {
    console.log("File upload", Array.from(files).map(a => a.name));
    this.files = of(Array.from(files).map(a => ({name: a.name, uploaded: false, progress: 74, size: Math.ceil(a.size/1024) })));
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

}
