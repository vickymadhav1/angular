import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ComponentRoutingModule } from './component-routing.module';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HomeComponent } from "./home/home.component";
import { QuizTestComponent } from "./quiz-test/quiz-test.component";
import { QuizResultsComponent } from "./quiz-results/quiz-results.component";
import { CompanyDetailsComponent } from "./company-details/company-details.component";
import { CompanyProfileComponent } from "./company-profile/company-profile.component";
import { DetailedReportComponent } from "./detailed-report/detailed-report.component";
import {
  MatAutocompleteModule,
  MatRadioModule,
  MatFormFieldModule,
  MatProgressBarModule,
  MatInputModule,
  MatTabsModule,
  MatDialogModule
} from "@angular/material";
import { ChartModule } from "primeng/chart";
import { RequestCompanyComponent } from "./request-company/request-company.component";
import { AuthenticationComponent } from './authentication/authentication.component';

@NgModule({
  declarations: [
    HomeComponent,
    QuizTestComponent,
    QuizResultsComponent,
    CompanyDetailsComponent,
    CompanyProfileComponent,
    DetailedReportComponent,
    RequestCompanyComponent,
    AuthenticationComponent
  ],
  imports: [
    CommonModule,
    ComponentRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatRadioModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatInputModule,
    ChartModule,
    MatTabsModule,
    MatDialogModule
  ],
  providers: [],
  entryComponents: [
    AuthenticationComponent
  ]
})
export class ComponentModule { }
