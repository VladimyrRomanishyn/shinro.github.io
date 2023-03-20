import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HtmlListingComponent } from './html-listing.component';

describe('HtmlListingComponent', () => {
  let component: HtmlListingComponent;
  let fixture: ComponentFixture<HtmlListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HtmlListingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HtmlListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
