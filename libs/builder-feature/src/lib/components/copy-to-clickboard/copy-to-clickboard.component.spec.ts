import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyToClickboardComponent } from './copy-to-clickboard.component';

describe('CopyToClickboardComponent', () => {
  let component: CopyToClickboardComponent;
  let fixture: ComponentFixture<CopyToClickboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CopyToClickboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CopyToClickboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
