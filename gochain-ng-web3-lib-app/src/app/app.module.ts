import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Libraries
import { GochainNgWeb3Module } from 'gochain-ng-web3';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GochainNgWeb3Module
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
