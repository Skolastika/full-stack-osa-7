import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Segment, List, Header, Icon, Label } from 'semantic-ui-react'

class Blogs extends React.Component {

  render() {
    return (
      <Segment>
        <Header as='h2'>Blogs</Header>
        <List celled>
          { this.props.blogs
            .sort((a, b) => b.likes - a.likes)
            .map(blog =>
              <List.Item key={ blog._id }>
                <Label ribbon><Icon name='bookmark' /></Label>
                <Link to={ `/blogs/${ blog._id }` }>{ blog.title }</Link>
              </List.Item>
            )
          }
        </List>
      </Segment>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    blogs: state.blogs.blogs
  }
}

const ConnectedBlogs = connect(mapStateToProps)(Blogs)

export default ConnectedBlogs