import React from 'react'
import { Link } from 'react-router-dom'
import { Segment, Header, List } from 'semantic-ui-react'

class User extends React.Component {

  render() {
    const user = this.props.user

    return (
      <Segment>
        <Header as='h2'>{ user.name }</Header>
        <Segment>
          <Header as='h3'>Added Blogs</Header>
          <List>
            { user.blogs.map(blog =>
              <List.Item key={ blog._id }>
                <List.Icon name='bookmark' />
                <List.Content><Link to={ `/blogs/${ blog._id }` }>{ blog.title }</Link></List.Content>
              </List.Item>
            )}
          </List>
        </Segment>
      </Segment>
    )
  }
}


export default User