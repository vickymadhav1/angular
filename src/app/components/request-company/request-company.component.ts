import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { UserService } from '../../service/user.service';
import { Router } from "@angular/router";
import { first } from 'rxjs/internal/operators/first';
import { CompanyService } from '../../service/company.service';

@Component({
  selector: 'app-request-company',
  templateUrl: './request-company.component.html',
  styleUrls: ['./request-company.component.scss']
})
export class RequestCompanyComponent implements OnInit {

  addCompanyForm: FormGroup;
  loading = false;
  submitted = false;
  constructor(private formBuilder: FormBuilder, private router: Router, private userService: UserService, private companySvc: CompanyService) { }


  ngOnInit() {
    this.addCompanyForm = new FormGroup({
      firstName: new FormControl()
    })


    this.addCompanyForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      companyName: [this.companySvc.companyName, Validators.required],
      comment: ['', Validators],
    });
  }
  get f() { return this.addCompanyForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.addCompanyForm.invalid) {
      return;
    }
    this.loading = true;
    this.userService.createCompany(this.addCompanyForm.value)
      .pipe(first())
      .subscribe(
        _data => {
          console.log(_data)
          alert("company added successfully")
          this.router.navigate(['']);
        },
        _error => {
          this.loading = false;
        });
  }
}
