import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {createCustomElement } from '@angular/elements';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { Demo1Component } from './components/demo1/demo1.component';
import { UploadDocsComponent } from './components/upload-docs/UploadDocs.component';
import { UploadAreaComponent } from './components/upload-docs/UploadArea.component';
import { UploadDocumentsService } from './components/upload-docs/UploadDocuments.service';

import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { counterReducer } from './counter.reducer';

import { I18NextModule } from 'angular-i18next';
import {I18N_PROVIDERS} from './i18next';
import { DndDirective } from './components/upload-docs/dnd.directive';

@NgModule({
  declarations: [
    AppComponent,
    Demo1Component,
    UploadDocsComponent,
    UploadAreaComponent,
    DndDirective,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    StoreModule.forRoot({ count: counterReducer }),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      //logOnly: environment.production, // Restrict extension to log-only mode
    }),
    I18NextModule.forRoot(),
  ],
  providers: [
    I18N_PROVIDERS,
    UploadDocumentsService,
  ],
  bootstrap: [AppComponent],
  entryComponents: [Demo1Component, UploadDocsComponent/*, UploadAreaComponent*/],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]

})
export class AppModule { 
  constructor(private injector: Injector) {}

  ngDoBootstrap() {
    const elements: any[] = [
      [Demo1Component, 'demo1-component'],
      [UploadDocsComponent, 'upload-docs'],
    ]; 

    for(const [c, name] of elements)
    {
      console.log(`define custom elem: ${name}`);
      const el = createCustomElement(c, {injector: this.injector});
      customElements.define(name, el);
    }

  }
}
