import { createAction, props } from '@ngrx/store';
import { ListingChanges } from './builder-feature.reducer';

export const setTarget = createAction(
  '[Builder Feature] Set Target',
  props<{target: HTMLElement | undefined}>()
)

export const editorDomChanged = createAction(
  '[Builder Feature] Editor DOM changed'
)

export const stylesChanged = createAction(
  '[Builder Feature] Styles changed'
)

export const listingChanges = createAction(
  '[Builder Feature] Listing Changed',
  props<{listingChanges: ListingChanges | undefined}>()
)
