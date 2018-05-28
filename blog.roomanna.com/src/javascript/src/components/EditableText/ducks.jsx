/* @flow */

// Actions
export const ONCHANGE = 'roomanna/editableText/ONCHANGE';

// Reducer
export default function reducer(state: Object = {}, action: Object = {}) {
  switch (action.type) {
    case ONCHANGE:
      return { ...state, [action.key]: action.value };
    default:
      return state;
  }
}

// Action Creators
export function on(value: number, key: string = 'value') {
  return { type: ONCHANGE, value, key };
}
