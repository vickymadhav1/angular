import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { QuizTestComponent } from './quiz-test/quiz-test.component';
import { QuizResultsComponent } from './quiz-results/quiz-results.component';
import { CompanyDetailsComponent } from "./company-details/company-details.component";
import { CompanyProfileComponent } from './company-profile/company-profile.component';
import { DetailedReportComponent } from './detailed-report/detailed-report.component';
import { RequestCompanyComponent } from "./request-company/request-company.component";
import { AuthGuardService } from '../service/auth-guard.service';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'quiz-test', component: QuizTestComponent,canActivate: [AuthGuardService]},
  { path: 'quiz-results', component: QuizResultsComponent,canActivate: [AuthGuardService]},
  { path: 'company-details', component: CompanyDetailsComponent, canActivate: [AuthGuardService]},
  { path: 'company-profile', component: CompanyProfileComponent, canActivate: [AuthGuardService]},
  { path: 'detailed-report', component: DetailedReportComponent, canActivate: [AuthGuardService]},
  { path: 'request-company', component: RequestCompanyComponent, canActivate: [AuthGuardService]}
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class ComponentRoutingModule { }
