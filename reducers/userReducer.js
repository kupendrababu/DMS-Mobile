import {
  LOG_IN_ERROR,
  LOG_IN_LOADING,
  LOG_IN_SUCCESS,
  SIGN_UP_LOADING,
  SIGN_UP_SUCCESS,
  SIGN_UP_ERROR,
  REFRESHING_TOKEN,
  REFRESHING_TOKEN_ERROR,
  TOKEN_REFRESHED
} from '../actionTypes/userConstants'

const initialState = {
  accessToken: null,
  token: null,
  signingUp: false,
  logingIn: false,
  error: {},
  signupError: false,
  loginError: false,
  refreshingToken: false,
  refreshingTokenError: false,
  tokenError: {}
}

const userReducer = (state=initialState, action) => {
  switch(action.type) {
    case LOG_IN_ERROR:
      return {...state, logingIn: false, loginError: action.data.status, error: {logIn: action.data.error}}
    case LOG_IN_LOADING:
      return {...state, logingIn: action.data}
    case LOG_IN_SUCCESS:
      return {...state, accessToken: action.data.refreshToken, logingIn: false, signingUp: false, signupError: false, loginError: false, token: action.data.token, message: action.data.message}
    case SIGN_UP_ERROR:
      return {...state, signupError: action.data.error.status, error: {signUp: action.data.error}}
    case SIGN_UP_LOADING:
      return {...state, signingUp: action.data}
    case SIGN_UP_SUCCESS:
      return {...state, logingIn: false, signingUp: false, signupError: false, loginError: false, token: action.data.token, message: action.data.message}
    case REFRESHING_TOKEN:
      return {...state, refreshingToken: action.data}
    case REFRESHING_TOKEN_ERROR:
      return {...state, refreshingTokenError: action.data.status, token: action.data.error}
    case TOKEN_REFRESHED:
      return {...state, token: action.data.token, accessToken: action.data.refreshToken}
    default:
      return state
  }
}

export default userReducer
