import { createAction, props } from '@ngrx/store';

export const setTarget = createAction(
  '[Builder Feature] Set Target',
  props<{target: HTMLElement | undefined}>()
)
