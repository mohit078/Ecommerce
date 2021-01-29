import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS, ɵHttpInterceptingHandler } from '@angular/common/http'; 

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToastrModule } from 'ngx-toastr';
import { AuthModule } from './components/auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { FormsModule } from '@angular/forms';
import { HeaderInterceptors } from './interceptors/header-interceptors';
import { ResponseInterceptors } from './interceptors/response-interceptors';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    AuthModule,
    FormsModule,
    ToastrModule.forRoot()
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: HeaderInterceptors, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ResponseInterceptors, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
