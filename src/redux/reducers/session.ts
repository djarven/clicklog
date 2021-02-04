import {TOKEN_STORE, TOKEN_REMOVE, TOKEN_CHECKED} from '../actionTypes'
const initialState = {
  token: 'none',
  valid: false,
  checked: false
}

export default function(state = initialState, action: any) {
  switch (action.type) {
    case TOKEN_STORE: {
      return {
        token: action.payload,
        valid: true,
        checked: true
      }
    }
    case TOKEN_REMOVE: {
      return {
        token: '',
        valid: false,
        checked: true
      }
    }
    case TOKEN_CHECKED: {
      return {
        ...state,
        checked: true
      }
    }
    default:
      return state
  }
}
