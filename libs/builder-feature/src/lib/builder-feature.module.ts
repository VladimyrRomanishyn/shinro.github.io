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
import { SliderModule } from 'primeng/slider';
import { StoreModule } from '@ngrx/store';
import {
  builderFeatureKey,
  builderFeatureReducer,
} from '@libs/builder-feature/src/lib/state/builder-feature.reducer';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ContextMenuComponent } from './views/builder-view/editor/context-menu/context-menu.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', pathMatch: 'full', component: BuilderViewComponent },
    ]),
    StoreModule.forFeature(builderFeatureKey, builderFeatureReducer),
    OverlayPanelModule,
    FormsModule,
    SliderModule,
    ReactiveFormsModule,
    InputSwitchModule,
  ],
  declarations: [
    BuilderViewComponent,
    EditorComponent,
    HtmlMarkupComponent,
    StyleSectionComponent,
    mouseEventsDirective,
    ToolbarComponent,
    DragdropDirective,
    ContextMenuComponent,
  ],
})
export class BuilderFeatureModule {}
