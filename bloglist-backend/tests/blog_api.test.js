const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


/*const blogObject = new Blog({
  title: 'mLab Blog',
  author: 'mLab',
  url: 'https://blog.mlab.com/',
  likes: 1
})*/

const blogObjectMissingLikes = new Blog({
  title: 'Google Blog',
  author: 'Google',
  url: 'https://www.blog.google.com/'
})

const blogObjectMissingTitle = new Blog({
  author: 'Robert C. Martin',
  url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
  likes: 2
})

const blogObjectMissingUrl = new Blog({
  title: 'Type wars',
  author: 'Robert C. Martin',
  likes: 2
})

let token
let user
let password
let savedUser
let blogObjects

describe('api tests', async () => {

  beforeAll(async () => {
    await User.remove({})
    password = 'sekret'
    const passwordHash = await bcrypt.hash(password, 10)
    user = new User({ username: 'root', password: passwordHash, name: 'Juuri', adult: true })

    savedUser = await user.save()
    const userForToken = {
      username: savedUser.username,
      id: savedUser._id
    }
    token = jwt.sign(userForToken, process.env.SECRET)
  })

  describe('testing GET', async () => {

    beforeAll(async () => {
      await Blog.remove({})
      const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
      const promiseArray = blogObjects.map(blog => blog.save())
      await Promise.all(promiseArray)
    })

    test('blogs are returned as json', async () => {
      const blogsInDatabase = await helper.blogsInDb()

      const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(response.body.length).toBe(blogsInDatabase.length)

      const returnedTitles = response.body.map(b => b.title)
      blogsInDatabase.forEach(blog => {
        expect(returnedTitles).toContain(blog.title)
      })

      const returnedUrls = response.body.map(b => b.url)
      blogsInDatabase.forEach(blog => {
        expect(returnedUrls).toContain(blog.url)
      })
    })

    test('there are six blogs', async () => {
      const response = await api
        .get('/api/blogs')

      expect(response.body.length).toBe(6)
    })

    test('the first blog is about React patterns', async () => {
      const response = await api
        .get('/api/blogs')

      expect(response.body[0].title).toBe('React patterns')
    })
  })

  describe('adding a blog', async () => {

    beforeAll(async () => {
      await Blog.remove({})
      const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
      const promiseArray = blogObjects.map(blog => blog.save())
      await Promise.all(promiseArray)
    })

    test('a valid blog can be added', async () => {
      const blogsBefore = await helper.blogsInDb()
      const users = await helper.usersInDb()

      let newBlog = {
        title: 'mLab Blog',
        author: 'mLab',
        url: 'https://blog.mlab.com/',
        likes: 1,
        user: users[0]._id
      }

      const result = await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${token}`)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      newBlog._id = result.body._id
      newBlog.comments = []
      const blogsAfter = await helper.blogsInDb()

      expect(blogsAfter.length).toBe(blogsBefore.length + 1)
      expect(blogsAfter.map(helper.filter)).toContainEqual(helper.filter(newBlog))
    })

    test('if likes not specified, likes equals 0', async () => {
      const blogsBefore = await helper.blogsInDb()
      const users = await helper.usersInDb()

      blogObjectMissingLikes.user = users[0]._id

      const result = await api
        .post('/api/blogs')
        .send(blogObjectMissingLikes)
        .set('Authorization', `Bearer ${token}`)

      expect(result.body.likes).toBe(0)

      const blogsAfter = await helper.blogsInDb()

      const blogWithZeroLikes = {
        _id: result.body._id,
        title: blogObjectMissingLikes.title,
        author: blogObjectMissingLikes.author,
        url: blogObjectMissingLikes.url,
        likes: 0,
        user: users[0]._id
      }

      expect(blogsAfter.length).toBe(blogsBefore.length + 1)
      expect(blogsAfter.map(helper.filter)).toContainEqual(helper.filter(blogWithZeroLikes))
    })

    test('if no title specified, bad request', async () => {
      const blogsBefore = await helper.blogsInDb()

      await api
        .post('/api/blogs')
        .send(blogObjectMissingTitle)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)

      const blogsAfter = await helper.blogsInDb()
      expect(blogsAfter.length).toBe(blogsBefore.length)
    })

    test('if no url specified, bad request', async () => {
      const blogsBefore = await helper.blogsInDb()

      await api
        .post('/api/blogs')
        .send(blogObjectMissingUrl)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)

      const blogsAfter = await helper.blogsInDb()
      expect(blogsAfter.length).toBe(blogsBefore.length)
    })
  })


  describe('deleting a blog', async () => {

    // blogObjects[0] has the logged in user as user
    // blogs might get saved in the database in a different order!
    beforeEach(async () => {
      await Blog.remove({})
      blogObjects = helper.initialBlogs
      blogObjects[0].user = user._id
      user.blogs.push(blogObjects[0]._id)
      await user.save()
      blogObjects = blogObjects.map(blog => new Blog(blog))
      const promiseArray = blogObjects.map(blog => blog.save())
      await Promise.all(promiseArray)
    })

    test('added by the same user with valid id returns 204', async () => {
      const blogsBefore = await helper.blogsInDb()
      const usersBefore = await helper.usersInDb()
      usersBefore.map(u => console.log(u))
      console.log('Users: ',usersBefore)
      console.log('blog: ',blogObjects[0])
      const foundUser = usersBefore.find(u => u._id.toString() === savedUser._id.toString())
      const userBlogsBefore = foundUser.blogs

      await api
        .delete(`/api/blogs/${blogObjects[0]._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const blogsAfter = await helper.blogsInDb()
      const usersAfter = await helper.usersInDb()
      const userBlogsAfter = usersAfter.find(u => u._id.toString === user._id.toString).blogs
      expect(blogsAfter.length).toBe(blogsBefore.length - 1)
      expect(blogsAfter.map(helper.filter)).not.toContainEqual(helper.filter(blogObjects[0]))
      expect(userBlogsAfter.length).toBe(userBlogsBefore.length - 1)
    })

    test('added by a different user with valid id returns 401', async () => {
      const blogsBefore = await helper.blogsInDb()

      await api
        .delete(`/api/blogs/${blogObjects[1]._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(401)

      const blogsAfter = await helper.blogsInDb()
      expect(blogsAfter.length).toBe(blogsBefore.length)
    })

    test('without a valid id returns 400', async () => {
      const blogsBefore = await helper.blogsInDb()

      await api
        .delete('/api/blogs/123')
        .set('Authorization', `Bearer ${token}`)
        .expect(400)

      const blogsAfter = await helper.blogsInDb()
      expect(blogsAfter.length).toBe(blogsBefore.length)
    })
  })


  describe('updating a blog', async () => {

    beforeAll(async () => {
      await Blog.remove({})
      const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
      const promiseArray = blogObjects.map(blog => blog.save())
      await Promise.all(promiseArray)
    })

    test('with valid id succeeds', async () => {
      const blogsBefore = await helper.blogsInDb()

      const blogUpdate = {
        title: blogsBefore[0].title,
        author: blogsBefore[0].author,
        url: blogsBefore[0].url,
        likes: 100
      }

      const response = await api
        .put(`/api/blogs/${blogsBefore[0]._id}`)
        .send(blogUpdate)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)

      const blogsAfter = await helper.blogsInDb()
      expect(blogsAfter.length).toBe(blogsBefore.length)
      expect(response.body.likes).toBe(blogUpdate.likes)
    })
  })

  describe('adding a user', async () => {

    test('POST /api/users succeeds with a new username', async () => {
      const usersBefore = await helper.usersInDb()

      const newUser = {
        username: 'nunneli',
        password: 'salanunneli',
        name: 'Nunnu',
        adult: false
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const usersAfter = await helper.usersInDb()
      expect(usersAfter.length).toBe(usersBefore.length + 1)
      const usernames = usersAfter.map(u => u.username)
      expect(usernames).toContain(newUser.username)
    })

    test('POST /api/users fails with a used username', async () => {
      const usersBefore = await helper.usersInDb()

      const newUser = {
        username: 'root',
        name: 'Superuser',
        password: 'salainen'
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body).toEqual({ error: 'username must be unique' })
      const usersAfter = await helper.usersInDb()
      expect(usersAfter.length).toBe(usersBefore.length)
    })

    test('POST /api/users fails with too short password', async () => {
      const usersBefore = await helper.usersInDb()

      const newUser = {
        username: 'nunnu',
        name: 'Nunnu',
        password: 's'
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body).toEqual({ error: 'password must be at least 3 characters long' })
      const usersAfter = await helper.usersInDb()
      expect(usersAfter.length).toBe(usersBefore.length)
    })

    test('if adult not specified, user is an adult', async () => {
      const newUser = {
        username: 'ninni',
        password: 'salaninni',
        name: 'Ninni'
      }

      const result = await api
        .post('/api/users')
        .send(newUser)

      expect(result.body.adult).toBe(true)
    })
  })

  describe('user login', async () => {

    test('succeeds with right username and password pair', async () => {
      const userLogin = { username: user.username, password: password }
      const result = await api
        .post('/api/login')
        .send(userLogin)
        .expect(200)

      const decodedToken = jwt.verify(result.body.token, process.env.SECRET)
      expect(decodedToken.id).toEqual(user._id.toString())
    })

    test('fails with wrong password', async () => {
      const userLogin = { username: user.username, password: 'wrongpassword' }
      const result = await api
        .post('/api/login')
        .send(userLogin)
        .expect(401)

      expect(result.body).toEqual({ error: 'invalid username or password' })
    })

    test('fails with nonexisting user', async () => {
      const userLogin = { username: 'nonexisting', password: password }
      const result = await api
        .post('/api/login')
        .send(userLogin)
        .expect(401)

      expect(result.body).toEqual({ error: 'invalid username or password' })
    })
  })
})

afterAll(() => {
  server.close()
})