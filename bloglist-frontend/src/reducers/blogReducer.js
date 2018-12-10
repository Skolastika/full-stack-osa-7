import blogService from '../services/blogs'

const initialState = {
  blogs: [],
  error: null
}

const blogReducer = (state = initialState, action) => {
  let tempBlogs = []

  switch (action.type) {
  case 'INIT_BLOGS_SUCCESS':
    return {
      blogs: action.blogs,
      error: null
    }
  case 'INIT_BLOGS_FAIL':
    return {
      blogs: [],
      error: `Failed to load blogs. ${action.error}`
    }
  case 'CREATE_BLOG_SUCCESS':
    return {
      blogs: state.blogs.concat(action.blog),
      error: null
    }
  case 'CREATE_BLOG_FAIL':
    return {
      ...state,
      error: `Failed to create blog. ${action.error}`
    }
  case 'UPDATE_BLOG_SUCCESS':
    tempBlogs = state.blogs
      .map(blog =>
        blog._id === action.blog._id
          ? action.blog
          : blog
      )
    return {
      blogs: tempBlogs,
      error: null
    }
  case 'UPDATE_BLOG_FAIL':
    return {
      ...state,
      error: `Failed to update blog. ${action.error}`
    }
  case 'REMOVE_BLOG_SUCCESS':
    tempBlogs = state.blogs
      .filter(blog => blog._id !== action.id)
    return {
      blogs: tempBlogs,
      error: null
    }
  case 'REMOVE_BLOG_FAIL':
    return {
      ...state,
      error: `Error while removing blog: ${action.error}`
    }

  default:
    return state
  }
}

export const initialiseBlogs = () => {
  return async dispatch => {
    try {
      const blogs = await blogService.getAll()
      dispatch({
        type: 'INIT_BLOGS_SUCCESS',
        blogs
      })
    } catch (error) {
      dispatch({
        type: 'INIT_BLOGS_FAIL',
        error
      })
    }
  }
}

export const createBlog = (blog) => {
  return async dispatch => {
    try {
      const newBlog = await blogService.create(blog)
      dispatch({
        type: 'CREATE_BLOG_SUCCESS',
        blog: newBlog
      })
    } catch (error) {
      dispatch({
        type: 'CREATE_BLOG_FAIL',
        error
      })
    }
  }
}

export const increaseLikes = (blog) => {
  return async dispatch => {
    const blogUpdate = {
      ...blog,
      likes: blog.likes + 1
    }

    if (blog.user !== undefined) {
      blogUpdate.user = blog.user._id.toString()
    }
    console.log('Attempt to update blog')
    try {
      const updatedBlog = await blogService.update(blog._id, blogUpdate)
      console.log(updatedBlog)
      dispatch({
        type: 'UPDATE_BLOG_SUCCESS',
        blog: updatedBlog
      })
    } catch (error) {
      dispatch({
        type: 'UPDATE_BLOG_FAIL',
        error
      })
    }
  }
}

export const addComment = (id, comment) => {
  return async dispatch => {
    console.log('Attempt to update blog')
    try {
      const blog = await blogService.getBlog(id)
      const blogUpdate = {
        ...blog,
        comments: blog.comments.concat(comment)
      }
      const updatedBlog = await blogService.update(blog._id, blogUpdate)
      console.log(updatedBlog)
      dispatch({
        type: 'UPDATE_BLOG_SUCCESS',
        blog: updatedBlog
      })
    } catch (error) {
      dispatch({
        type: 'UPDATE_BLOG_FAIL',
        error
      })
    }
  }
}

export const removeBlog = (id) => {
  return async dispatch => {
    try {
      await blogService.remove(id)
      dispatch({
        type: 'REMOVE_BLOG_SUCCESS',
        id
      })
    } catch (error) {
      console.log(error)
      dispatch({
        type: 'REMOVE_BLOG_FAIL',
        error
      })
    }
  }
}

export default blogReducer