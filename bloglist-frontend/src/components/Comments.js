import React from 'react'
import PropTypes from 'prop-types'
import { Segment, Header, List } from 'semantic-ui-react'
import CommentForm from './CommentForm'

class Comments extends React.Component {

  render() {
    return (
      <Segment>
        <Header as='h3'>Comments</Header>
        <CommentForm blog={ this.props.blog } />
        <List>
          { this.props.blog.comments.map(comment =>
            <List.Item key={ comment }>
              <List.Icon name='comment' />
              <List.Content>{ comment }</List.Content>
            </List.Item>) }
        </List>
      </Segment>
    )
  }
}

Comments.propTypes = {
  blog: PropTypes.object.isRequired
}

export default Comments