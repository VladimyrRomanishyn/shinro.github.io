import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StyleSectionComponent } from './style-section.component';

describe('StyleSectionComponent', () => {
  let component: StyleSectionComponent;
  let fixture: ComponentFixture<StyleSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StyleSectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StyleSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
