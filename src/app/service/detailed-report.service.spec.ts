import { TestBed } from '@angular/core/testing';

import { DetailedReportService } from './detailed-report.service';

describe('DetailedReportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DetailedReportService = TestBed.get(DetailedReportService);
    expect(service).toBeTruthy();
  });
});
