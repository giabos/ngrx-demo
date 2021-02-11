import { Component, OnInit } from '@angular/core';
import { UploadDocumentsService } from './UploadDocuments.service';

@Component({
  selector: 'upload-docs',
  templateUrl: './UploadDocs.component.html',
  styleUrls: ['./UploadDocs.component.scss']
})
export class UploadDocsComponent {

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
    this.uploadDocumentsService.confirmUploadAllDocuments().subscribe(() => {
      console.log("confirm upload");
      this.isModalOpen = "false"
    });
  }

}
