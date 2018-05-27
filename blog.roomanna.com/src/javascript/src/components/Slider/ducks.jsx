/* @flow */

// Actions
export const ONVALUE = 'roomanna/slider/ONVALUE';

// Reducer
export default function reducer(state: Object = {}, action: Object = {}) {
  switch (action.type) {
    case ONVALUE:
      return { ...state, [action.key]: action.value };
    default:
      return state;
  }
}

// Action Creators
export function onValue(value: number, key: string = 'value') {
  return { type: ONVALUE, value, key };
}
