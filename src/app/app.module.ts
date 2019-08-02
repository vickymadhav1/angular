import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { HttpClientModule } from '@angular/common/http';

import {
  MatButtonModule,
  MatToolbarModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule,
  MatFormFieldModule,
  MatInputModule,
  MatRippleModule,
  MatAutocompleteModule,
  MatRadioModule,

} from '@angular/material';

import { AppComponent } from './app.component';
import { ComponentsComponent } from './components/components.component';
import { LayoutComponent } from './components/layout/layout.component';
import { LayoutModule } from '@angular/cdk/layout';
import { AppRoutingModule } from './app-routing.module';
import { FooterComponent } from './commmon/footer/footer.component';
import { HeaderComponent } from './commmon/header/header.component';

import { UserService } from './service/user.service';
import { QuestionsService } from './service/questions.service';
import { CompanyService } from './service/company.service';
import { AuthenticationService } from "./service/authentication.service";
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { HomeService } from './service/home.service';

@NgModule({
  declarations: [
    AppComponent,
    ComponentsComponent,
    LayoutComponent,
    FooterComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatButtonModule,
    LayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatAutocompleteModule,
    MatRadioModule,
    ChartModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
  ],
  providers: [
    UserService,
    QuestionsService,
    CompanyService,
    AuthenticationService,
    HomeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
