import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BuilderViewComponent } from './views/builder-view/builder-view.component';
import { EditorComponent } from './views/builder-view/editor/editor.component';
import { HtmlMarkupComponent } from './views/builder-view/html-markup/html-markup.component';
import { StyleSectionComponent } from './views/builder-view/style-section/style-section.component';
import { mouseEventsDirective } from './directives/mouseEvents.directive';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ToolbarComponent } from './views/builder-view/toolbar/toolbar.component';
import { DragdropDirective } from './directives/dragdrop.directive';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', pathMatch: 'full', component: BuilderViewComponent },
    ]),
    OverlayPanelModule,
  ],
  declarations: [
    BuilderViewComponent,
    EditorComponent,
    HtmlMarkupComponent,
    StyleSectionComponent,
    mouseEventsDirective,
    ToolbarComponent,
    DragdropDirective,
  ],
})
export class BuilderFeatureModule {}
