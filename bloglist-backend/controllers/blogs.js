const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })

  response.json(blogs.map(Blog.format))
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog
    .findById(request.params.id)
    .populate('user', { username: 1, name: 1 })

  response.json(Blog.format(blog))
})

blogsRouter.post('/', async (request, response) => {
  try {
    const body = request.body
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    if (body.title === undefined) {
      return response.status(400).send({ error: 'missing title' })
    }

    if (body.url === undefined) {
      return response.status(400).send({ error: 'missing url' })
    }

    const user = await User.findById(decodedToken.id)

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes === undefined ? 0 : body.likes,
      user: user._id
    })

    const savedBlog = await blog.save()
    savedBlog.populate('user', { username: 1, name: 1 })

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(Blog.format(savedBlog))

  } catch (exception) {
    if (exception.name === 'JsonWebTokenError' ) {
      response.status(401).json({ error: exception.message })
    } else {
      console.log(exception)
      response.status(500).json({ error: 'something went wrong...' })
    }
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  try {
    const blog = await Blog.findById(request.params.id)
    console.log(request.token)

    if (!blog) {
      return response.status(204).end()
    }
    if (blog.user !== undefined) {
      const decodedToken = jwt.verify(request.token, process.env.SECRET)

      if (!request.token || !decodedToken.id) {
        console.log('token missing or invalid')
        return response.status(401).json({ error: 'token missing or invalid' })
      }

      const user = await User.findById(decodedToken.id)
      console.log('found user')

      if (blog.user.toString() === user._id.toString()) {
        await blog.remove()
        user.blogs = user.blogs.filter( b => b.toString() !== request.params.id.toString() )
        await user.save()
        return response.status(204).end()
      } else {
        console.log('blog entry created by different user')
        return response.status(401).json({ error: 'blog entry created by different user' })
      }
    } else {
      await blog.remove()
      return response.status(204).end()
    }
  } catch (exception) {
    console.log('exception')
    if (exception.name === 'JsonWebTokenError' ) {
      return response.status(401).json({ error: exception.message })
    } else {
      console.log(exception)
      return response.status(400).send({ error: 'malformed id' })
    }
  }
})

blogsRouter.put('/:id', async (request, response) => {
  try {
    const body = request.body
    const blog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      comments: body.comments
    }
    const updatedBlog = await Blog
      .findByIdAndUpdate(request.params.id, blog, { new: true })
      .populate('user', { username: 1, name: 1 })
    response.status(200).json(Blog.format(updatedBlog))

  } catch (exception) {
    console.log(exception)
    response.status(400).send({ error: 'malformed id' })
  }
})

module.exports = blogsRouter