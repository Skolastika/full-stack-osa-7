import loginService from '../services/login'
import userService from '../services/users'
import blogService from '../services/blogs'

const initialState = {
  users: [],
  currentUser: null,
  error: null
}

const userReducer = (state = initialState, action) => {
  switch (action.type) {
  case 'INIT_USERS_SUCCESS':
    return {
      ...state,
      users: action.users,
      error: null
    }
  case 'INIT_USERS_FAIL':
    return {
      ...state,
      users: [],
      error: `Failed to load users. ${action.error}`
    }
  case 'SET_USER':
    return {
      ...state,
      currentUser: action.user,
      error: null
    }
  case 'LOGIN_FAIL':
    return {
      ...state,
      currentUser: null,
      error: action.error
    }
  default:
    return state
  }
}

export const initialiseUsers = () => {
  return async (dispatch) => {
    try {
      console.log('Trying to initialise users...')
      const users = await userService.getAll()
      console.log('Success with users')
      dispatch({
        type: 'INIT_USERS_SUCCESS',
        users
      })
    } catch (error) {
      console.log(`Failed to load users. ${error}`)
      dispatch({
        type: 'INIT_USERS_FAIL',
        error
      })
    }
  }
}

export const login = (username, password) => {
  return async (dispatch) => {
    try {
      const user = await loginService.login({ username, password })
      blogService.setToken(user.token)
      window.localStorage.setItem('loggedBloglistUser', JSON.stringify(user))
      console.log('Login: ', user)
      dispatch({
        type: 'SET_USER',
        user
      })
    } catch(error) {
      console.log('login error')
      dispatch({
        type: 'LOGIN_FAIL',
        error: 'Wrong username or password.'
      })
    }
  }
}

export const logout = () => {
  return (dispatch) => {
    blogService.setToken(null)
    window.localStorage.removeItem('loggedBloglistUser')
    dispatch({
      type: 'SET_USER',
      user: null
    })
  }
}

export const setUser = (user) => {
  return (dispatch) => {
    console.log('Set user: ', user)
    dispatch({
      type: 'SET_USER',
      user
    })
  }
}

export default userReducer