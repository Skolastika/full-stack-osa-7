import React from 'react'
import { connect } from 'react-redux'
import { notify } from '../reducers/notificationReducer'
import { addComment } from '../reducers/blogReducer'
import { Form, Button } from 'semantic-ui-react'

class CommentForm extends React.Component {

  addComment = async (event) => {
    event.preventDefault()
    const comment = event.target.comment.value
    event.target.comment.value = ''

    if (comment.length > 0) {
      console.log('Adding comment...')
      await this.props.addComment(this.props.blog._id, comment)

      if (this.props.error) {
        console.log('Error adding comment...')
        this.props.notify(this.props.error, 10, 'red')
      } else {
        console.log('Added comment!')
        this.props.notify(`A new comment '${ comment }' was added for the blog '${ this.props.blog.title }'.`, 10, 'green')
      }
    }
  }

  render() {
    return (
      <Form onSubmit={ this.addComment }>
        <input type='text' name='comment' />
        <Button type='submit'>Add comment</Button>
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
  addComment
}

const ConnectedCommentForm = connect(mapStateToProps, mapDispatchToProps)(CommentForm)

export default ConnectedCommentForm