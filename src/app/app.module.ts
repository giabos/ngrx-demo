import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import {createCustomElement } from '@angular/elements';

import { AppComponent } from './app.component';
import { Demo1Component } from './components/demo1/demo1.component';

import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { counterReducer } from './counter.reducer';



@NgModule({
  declarations: [
    AppComponent,
    Demo1Component
  ],
  imports: [
    BrowserModule,
    StoreModule.forRoot({ count: counterReducer }),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      //logOnly: environment.production, // Restrict extension to log-only mode
    }),
  ],
  providers: [],
  //bootstrap: [AppComponent],
  entryComponents: [Demo1Component]

})
export class AppModule { 
  constructor(private injector: Injector) {}

  ngDoBootstrap() {
    const elements: any[] = [
      [Demo1Component, 'demo1-component'],
    ]; 

    for(const [c, name] of elements)
    {
      console.log(`define custom elem: ${name}`);
      const el = createCustomElement(c, {injector: this.injector});
      customElements.define(name, el);
    }

  }
}
