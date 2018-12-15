import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Segment, Header, Button, Icon, Label, Grid } from 'semantic-ui-react'
import { increaseLikes, removeBlog } from '../reducers/blogReducer'
import Comments from './Comments'

class Blog extends React.Component {

  render() {
    const blog = this.props.blog

    if (blog) {
      const userName = blog.user ? blog.user.name : '?'

      const RemoveButton = ({ blog, user }) => {
        if (!blog.user || blog.user._id === user.id) {
          return <Button floated='right' onClick={ () => this.props.removeBlog(blog._id) }>Remove</Button>
        }
        return null
      }

      return (
        <Segment>
          <Header as='h2'>{ blog.title } by { blog.author }</Header>
          <Grid container columns='equal'>
            <Grid.Row>
              <a href={blog.url}>{ blog.url }</a>
            </Grid.Row>
            <Grid.Row>
              <Button as='div' labelPosition='left'>
                <Label basic pointing='right'>{ blog.likes }</Label>
                <Button animated='fade' onClick={ () => this.props.increaseLikes(blog) }>
                  <Button.Content visible><Icon name='thumbs up' /></Button.Content>
                  <Button.Content hidden>Like</Button.Content>
                </Button>
              </Button>
              <RemoveButton blog={blog} user={this.props.user} />
            </Grid.Row>
            <Grid.Row>
              added by { userName }
            </Grid.Row>
            <Grid.Row>
              <Comments blog={ blog } />
            </Grid.Row>
          </Grid>
        </Segment>
      )
    }
    return null
  }
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
  return {
    user: state.user.currentUser,
    error: state.blogs.error,
    loading: state.blogs.loading
  }
}

const mapDispatchToProps = {
  increaseLikes,
  removeBlog
}

const ConnectedBlog = connect(mapStateToProps, mapDispatchToProps)(Blog)

export default ConnectedBlog