import React from 'react'
import { connect } from 'react-redux'
import { NavLink, withRouter } from 'react-router-dom'
import { Menu as SemanticMenu, Button, Icon } from 'semantic-ui-react'
import { logout } from '../reducers/userReducer'

class Menu extends React.Component {

  render() {
    return (
      <SemanticMenu attached='top' tabular>
        <SemanticMenu.Item as={NavLink} exact to='/'>Blogs</SemanticMenu.Item>
        <SemanticMenu.Item as={NavLink} exact to='/users'>Users</SemanticMenu.Item>
        <SemanticMenu.Item>{ this.props.user.name } logged in.</SemanticMenu.Item>
        <SemanticMenu.Item>
          <Button animated='fade' onClick={ this.props.logout }>
            <Button.Content visible><Icon name='log out' /></Button.Content>
            <Button.Content hidden>Log out</Button.Content>
          </Button>
        </SemanticMenu.Item>
      </SemanticMenu>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.currentUser
  }
}

const mapDispatchToProps = {
  logout
}

const ConnectedMenu = connect(mapStateToProps, mapDispatchToProps)(Menu)

export default withRouter(ConnectedMenu)