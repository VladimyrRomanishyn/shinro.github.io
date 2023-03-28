import { createReducer, on } from '@ngrx/store';
import * as BuilderFeatureActions from './builder-feature.actions'

export interface ListingChanges {
  id: string,
  changeType: string,
  data: string
}
export interface BuilderFeatureState {
  target: HTMLElement | undefined;
  editorDomChanged: boolean;
  stylesChanged: boolean;
  listingChanges: ListingChanges | undefined;
}

export const initialState: BuilderFeatureState = {
  target: undefined,
  editorDomChanged: false,
  stylesChanged: false,
  listingChanges: undefined
}

export const builderFeatureKey = 'builder-feature';

export const builderFeatureReducer = createReducer(
  initialState,
  on
  (
    BuilderFeatureActions.setTarget,
    (state, {target}) => ({...state, target})
  ),
  on
  (
    BuilderFeatureActions.editorDomChanged,
    (state) => ({...state, editorDomChanged: !state.editorDomChanged})
  ),
  on
  (
    BuilderFeatureActions.stylesChanged,
    (state) => ({...state, stylesChanged: !state.stylesChanged})
  ),
  on
  (
    BuilderFeatureActions.listingChanges,
    (state, {listingChanges}) => ({...state, listingChanges})
  ),
)
