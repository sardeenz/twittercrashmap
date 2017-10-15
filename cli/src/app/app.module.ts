import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { EsriMapComponent } from './esri-map/esri-map.component';
import { EsriLoaderService } from 'angular2-esri-loader';

@NgModule({
  declarations: [
    AppComponent,
    EsriMapComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'my-app'}),
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full'},
      { path: 'lazy', loadChildren: './lazy/lazy.module#LazyModule'},
      { path: 'lazy/nested', loadChildren: './lazy/lazy.module#LazyModule'}
    ])
  ],
  providers: [EsriLoaderService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
