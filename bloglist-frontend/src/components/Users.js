import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Table, Icon, Label, Segment, Header } from 'semantic-ui-react'

class Users extends React.Component {

  render() {
    return (
      <Segment>
        <Header as='h2'>Users</Header>
        <Table collapsing>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell></Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
              <Table.HeaderCell>Blogs added</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            { this.props.users
              .map(user =>
                <Table.Row key={ user._id }>
                  <Table.Cell><Label ribbon><Icon name='user' /></Label></Table.Cell>
                  <Table.Cell><Link to={ `/users/${ user._id }` }>{ user.name }</Link></Table.Cell>
                  <Table.Cell>{ user.blogs.length }</Table.Cell>
                </Table.Row>) }
          </Table.Body>
        </Table>
      </Segment>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    users: state.user.users
  }
}

const ConnectedUsers = connect(mapStateToProps)(Users)

export default ConnectedUsers