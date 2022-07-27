import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuilderViewComponent } from './builder-view.component';
import { EditorComponent } from '@libs/builder-feature/src/lib/views/builder-view/editor/editor.component';
import {
  HtmlMarkupComponent
} from '@libs/builder-feature/src/lib/views/builder-view/html-markup/html-markup.component';
import {
  StyleSectionComponent
} from '@libs/builder-feature/src/lib/views/builder-view/style-section/style-section.component';
import { MockComponent } from 'ng-mocks';

describe('BuilderViewComponent', () => {
  let component: BuilderViewComponent;
  let fixture: ComponentFixture<BuilderViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        BuilderViewComponent,
        MockComponent(EditorComponent),
        MockComponent(HtmlMarkupComponent),
        MockComponent(StyleSectionComponent),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BuilderViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
