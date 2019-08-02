import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
// import  {  }  from 'rxjs/add/operator/map';


@Injectable()
export class CompanyService {
 
  private readonly getCompanyProfileApi = "company-listCompany";

  companyValue = '';
  companyId = '';
  constructor(private httpService: HttpService) { }

  getCompanyProfile() {
    return this.httpService.get(this.getCompanyProfileApi);
  }

  set companayName(val) {
    this.companyValue = val;
    }
    get companyName() {
    return this.companyValue;
  }

  setParticularCompanyId(id) {
    this.companyId = id;
    console.log(this.companyId);
  }

  getParticularCompanyId() {
    return this.companyId;
  }
}