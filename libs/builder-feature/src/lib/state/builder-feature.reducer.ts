import { createReducer, on } from '@ngrx/store';
import * as BuilderFeatureActions from './builder-feature.actions'

export interface BuilderFeatureState {
  target: HTMLElement | undefined
}

export const initialState: BuilderFeatureState = {
  target: undefined
}

export const builderFeatureKey = 'builder-feature';

export const builderFeatureReducer = createReducer(
  initialState,
  on
  (
    BuilderFeatureActions.setTarget,
    (state, {target}) => ({...state, target})
  )
)
