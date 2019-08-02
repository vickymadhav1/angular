import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable()
export class HomeService {

  private readonly getCompanyNamesApi = "admin/top-ten/";
  private readonly getCompanyToplistApi = "company-searchListCompany/";
  private readonly dropdownCompanyApi = "admin/dropdown/company-list/";

  constructor(private httpService: HttpService) { }

  getCompanyNames() {
    return this.httpService.get(this.getCompanyNamesApi);
  }

  getCompanyToplist() {
    return this.httpService.get(this.getCompanyToplistApi);
  }

  getDropdownCompany() {
    return this.httpService.get(this.dropdownCompanyApi);
  }

  setCompanyId(id) {
    sessionStorage.setItem('companyId', id);
  }

  removeCompanyId() {
    sessionStorage.removeItem('companyId');
  }

  setUserId(id) {
    sessionStorage.setItem('userId', id);
  }

  removeUserId() {
    sessionStorage.removeItem('userId');
  }
}
