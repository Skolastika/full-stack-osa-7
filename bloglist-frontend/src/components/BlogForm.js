import React from 'react'
import { connect } from 'react-redux'
import { Form, Button } from 'semantic-ui-react'
import { notify } from '../reducers/notificationReducer'
import { createBlog } from '../reducers/blogReducer'

class BlogForm extends React.Component {

  addBlog = async (event) => {
    event.preventDefault()

    if (event.target.title.value.length > 0 &&
        event.target.url.value.length > 0) {

      const blogObject = {
        title: event.target.title.value,
        author: event.target.author.value,
        url: event.target.url.value
      }

      event.target.title.value = ''
      event.target.author.value = ''
      event.target.url.value = ''

      await this.props.createBlog(blogObject)

      if (this.props.error) {
        console.log('Error adding blog...')
        this.props.notify(this.props.error, 10, 'red')
      } else {
        console.log('Added blog!')
        this.props.notify(`A new blog '${blogObject.title}' was added.`, 10, 'green')
      }
    }
  }

  render() {
    return (
      <Form onSubmit={this.addBlog}>
        <Form.Field>
          title:
          <input
            type="text"
            name="title"
          />
        </Form.Field>
        <Form.Field>
          author:
          <input
            type="text"
            name="author"
          />
        </Form.Field>
        <Form.Field>
          url:
          <input
            type="text"
            name="url"
          />
        </Form.Field>
        <Button type="submit">Add blog</Button>
      </Form>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    error: state.blogs.error
  }
}

const mapDispatchToProps = {
  notify,
  createBlog
}

const ConnectedBlogForm = connect(mapStateToProps, mapDispatchToProps)(BlogForm)

export default ConnectedBlogForm