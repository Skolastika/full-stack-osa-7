const initialState = {
  notification: null,
  color: 'white'
}

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
  case 'SET_NOTIFICATION':
    return {
      notification: action.notification,
      color: action.color
    }
  case 'CLEAR_NOTIFICATION':
    return initialState
  default:
    return state
  }
}

export const notify = (notification, timeout, color='white') => {
  return (dispatch) => {
    console.log('Dispatching notification: '+notification)
    dispatch({
      type: 'SET_NOTIFICATION',
      notification,
      color
    })
    setTimeout(() => {
      dispatch({
        type: 'CLEAR_NOTIFICATION'
      })
    }, timeout * 1000)
  }
}


export default notificationReducer