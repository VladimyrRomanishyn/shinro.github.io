import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CSSListingComponent } from './css-listing.component';

describe('CodeEditorComponent', () => {
  let component: CSSListingComponent;
  let fixture: ComponentFixture<CSSListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CSSListingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CSSListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
