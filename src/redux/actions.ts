import {TOKEN_STORE, TOKEN_REMOVE, TOKEN_CHECKED} from './actionTypes'

export const tokenStore = (token: string) => ({
  type: TOKEN_STORE,
  payload: token
})

export const tokenRemove = () => ({
  type: TOKEN_REMOVE
})

export const tokenChecked = () => ({
  type: TOKEN_CHECKED
})
