import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestCompanyComponent } from './request-company.component';

describe('RequestCompanyComponent', () => {
  let component: RequestCompanyComponent;
  let fixture: ComponentFixture<RequestCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
