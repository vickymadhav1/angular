import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { UserService } from 'src/app/service/user.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnInit {
  registerForm: FormGroup;
  loginForm: FormGroup;
  model: any = {};
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public authService: AuthenticationService,
    private userService: UserService,
    public dialogRef: MatDialogRef<AuthenticationComponent>,
    @Inject(MAT_DIALOG_DATA) public passedData: any
  ) { }

  ngOnInit() {
    console.log(this.passedData)
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      gender: ['', Validators.required]
    });

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  // register a new user
  register() {
    this.userService.register(this.registerForm.value).subscribe((res: any) => {
      console.log(res);
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  // login if user exists
  onSubmit() {
    this.userService.login(this.model).subscribe((res: any) => {
      console.log(res.data);
      if(res.statusCode === 200) {
        this.authService.setUserDetailsWithToken(res.data);
        this.passedData.user = res.data;
        if(this.authService.isLoggednIn()) {
          this.dialogRef.close(this.passedData);
        }
      }
    });
  }

}
