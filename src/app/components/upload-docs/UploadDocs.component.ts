import { Component, OnInit } from '@angular/core';
import { UploadDocumentsService } from './UploadDocuments.service';

@Component({
  selector: 'upload-docs',
  templateUrl: './UploadDocs.component.html',
  styleUrls: ['./UploadDocs.component.scss']
})
export class UploadDocsComponent implements OnInit {

  isModalOpen: string = "true";

  constructor(private uploadDocumentsService : UploadDocumentsService) {
    
  }

  onCloseModal () {
    this.isModalOpen = "false";
  }

  onOpenModal () {
    this.isModalOpen = "true";
  }

  onConfirmUploadDocuments () {
    console.log("confirm upload");
    this.isModalOpen = "false"
  }

  ngOnInit(): void {
  }

}
