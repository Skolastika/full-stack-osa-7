import React from 'react'
import { connect } from 'react-redux'
import { login } from '../reducers/userReducer'
import { notify } from '../reducers/notificationReducer'
import { Form, Button } from 'semantic-ui-react'

class LoginForm extends React.Component {
  login = async (event) => {
    event.preventDefault()
    await this.props.login(event.target.username.value, event.target.password.value)

    console.log(event)
    console.log(this.props.error)
    // BUG: If an error has been logged previously, this function thinks
    //      it's still there even if it isn't. Why?
    if (this.props.error) {
      console.log('Notifying about login error...')
      this.props.notify(this.props.error, 10, 'red')
    }
  }

  render() {
    console.log('Error: ', this.props.error)
    return (
      <Form onSubmit={ this.login }>
        <div>
          username:
          <input
            type="text"
            name="username"
          />
        </div>
        <div>
          password:
          <input
            type="password"
            name="password"
          />
        </div>
        <Button type="submit">Log in</Button>
      </Form>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    error: state.user.error
  }
}

const mapDispatchToProps = {
  login,
  notify
}

const ConnectedLoginForm = connect(mapStateToProps, mapDispatchToProps)(LoginForm)

export default ConnectedLoginForm