import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportAddFormComponent } from './report-add-form.component';

describe('ReportAddFormComponent', () => {
  let component: ReportAddFormComponent;
  let fixture: ComponentFixture<ReportAddFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportAddFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportAddFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
