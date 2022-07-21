import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuilderViewComponent } from './builder-view.component';

describe('BuilderViewComponent', () => {
  let component: BuilderViewComponent;
  let fixture: ComponentFixture<BuilderViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BuilderViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BuilderViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
