import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowMoreInfoComponent } from './show-more-info.component';

describe('ShowMoreInfoComponent', () => {
  let component: ShowMoreInfoComponent;
  let fixture: ComponentFixture<ShowMoreInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowMoreInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowMoreInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
