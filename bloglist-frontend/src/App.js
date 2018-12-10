import React from 'react'
import { connect } from 'react-redux'
import { Route, withRouter } from 'react-router-dom'
import { Header, Container, Segment } from 'semantic-ui-react'
import Menu from './components/Menu'
import Blogs from './components/Blogs'
import Users from './components/Users'
import Blog from './components/Blog'
import User from './components/User'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import { initialiseUsers, setUser } from './reducers/userReducer'
import { initialiseBlogs } from './reducers/blogReducer'

class App extends React.Component {

  async componentDidMount() {
    await this.props.initialiseBlogs()
    await this.props.initialiseUsers()

    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      await this.props.setUser(JSON.parse(loggedUserJSON))
    }
  }

  render() {
    const blogById = (id) => {
      console.log('Finding blog... ', id)
      const blog = this.props.blogs.find(blog => blog._id === id)
      console.log(blog)
      return blog
    }

    const userById = (id) => {
      console.log('Finding user...', id)
      const user = this.props.users.find(user => user._id === id)
      console.log(user)
      return user
    }

    if (this.props.user === null) {
      return (
        <Container>
          <Header as='h1'>Blog App</Header>
          <Header as='h2'>Log in to application</Header>
          <Notification />
          <Togglable buttonLabel="Log in">
            <LoginForm />
          </Togglable>
        </Container>
      )
    } else {
      return (
        <Container>
          <Header as='h1'>Blog App</Header>
          <Menu />
          <Segment attached='bottom'>
            <Notification />
            <Togglable buttonLabel="Create new blog">
              <BlogForm />
            </Togglable>
            <Route exact path='/' component={ Blogs } />
            <Route exact path='/blogs/:id' render={ ({ match }) =>
              <Blog blog={ blogById(match.params.id) } /> } />
            <Route exact path='/users' component={ Users } />
            <Route exact path='/users/:id' render={ ({ match }) =>
              <User user={ userById(match.params.id) } /> } />
          </Segment>
        </Container>
      )
    }
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.currentUser,
    users: state.user.users,
    blogs: state.blogs.blogs
  }
}

const mapDispatchToProps = {
  initialiseUsers,
  setUser,
  initialiseBlogs
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App))

