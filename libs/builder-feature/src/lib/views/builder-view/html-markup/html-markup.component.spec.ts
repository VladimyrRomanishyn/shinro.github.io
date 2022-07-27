import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HtmlMarkupComponent } from './html-markup.component';

describe('HtmlMarkupComponent', () => {
  let component: HtmlMarkupComponent;
  let fixture: ComponentFixture<HtmlMarkupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HtmlMarkupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HtmlMarkupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
