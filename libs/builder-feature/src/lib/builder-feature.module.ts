import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BuilderViewComponent } from './views/builder-view/builder-view.component';
import { EditorComponent } from './views/builder-view/editor/editor.component';
import { StyleSectionComponent } from './views/builder-view/style-section/style-section.component';
import { mouseEventsDirective } from './directives/mouseEvents.directive';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { DropdownModule } from 'primeng/dropdown';
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
import { ContextMenuComponent } from './views/builder-view/editor/components/context-menu/context-menu.component';
import { TagsModalComponent } from './views/builder-view/editor/components/tags-modal/tags-modal.component';
import { TabViewModule } from 'primeng/tabview';
import { CSSListingComponent } from './views/builder-view/style-section/components/css-listing/css-listing.component';
import { HtmlListingComponent } from './views/builder-view/style-section/components/html-listing/html-listing.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { CopyToClickboardComponent } from './components/copy-to-clickboard/copy-to-clickboard.component';
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
    DropdownModule,
    TabViewModule,
    ClipboardModule,
  ],
  declarations: [
    BuilderViewComponent,
    EditorComponent,
    StyleSectionComponent,
    mouseEventsDirective,
    ToolbarComponent,
    DragdropDirective,
    ContextMenuComponent,
    TagsModalComponent,
    CSSListingComponent,
    HtmlListingComponent,
    CopyToClickboardComponent,
  ],
})
export class BuilderFeatureModule {}
