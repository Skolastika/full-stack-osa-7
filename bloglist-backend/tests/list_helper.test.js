const listHelper = require('../utils/list_helper')
const testHelper = require('./test_helper')

const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  }
]

const testBlogs = [
  {
    _id: '5bd02e2da43ef02700242bf0',
    title: 'mLab Blog',
    author: 'mLab',
    url: 'https://blog.mlab.com/',
    likes: 1,
    __v: 0
  },
  {
    _id: '5bd05791a43ef02700242bf1',
    title: 'Google Blog',
    author: 'Google',
    url: 'https://www.blog.google.com/',
    likes: 3,
    __v: 0
  },
  {
    _id: '5bd17675c98b460afc481728',
    title: 'The Wordpress.com Blog',
    author: 'Wordpress',
    url: 'https://en.blog.wordpress.com/',
    likes: 2,
    __v: 0
  }
]


describe.skip('list helper tests', () => {

  test('dummy is called', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
  })


  describe('total likes', () => {

    test('of one blog equals likes of that blog', () => {
      expect(listHelper.totalLikes(listWithOneBlog)).toBe(5)
    })

    test('of many blogs is the sum of likes', () => {
      expect(listHelper.totalLikes(testBlogs)).toBe(6)
    })

    test('of empty array equals 0', () => {
      expect(listHelper.totalLikes([])).toBe(0)
    })
  })


  describe('favorite blog', () => {

    test('of one blog equals that blog', () => {
      expect(listHelper.favoriteBlog(listWithOneBlog)).toEqual({
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        likes: 5
      })
    })

    test('of many blogs is the one with most likes', () => {
      expect(listHelper.favoriteBlog(testHelper.initialBlogs)).toEqual({
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        likes: 12
      })
    })

    test('of empty array is an undefined blog', () => {
      expect(listHelper.favoriteBlog([])).toEqual({
        title: undefined,
        author: undefined,
        likes: undefined
      })
    })
  })


  describe('author with most blogs', () => {

    test('of one blog is the author of that blog', () => {
      expect(listHelper.mostBlogs(listWithOneBlog)).toEqual({
        author: 'Edsger W. Dijkstra',
        blogs: 1
      })
    })

    test('of many blogs is the one with most blogs', () => {
      expect(listHelper.mostBlogs(testHelper.initialBlogs)).toEqual({
        author: 'Robert C. Martin',
        blogs: 3
      })
    })

    test('of no blogs is undefined', () => {
      expect(listHelper.mostBlogs([])).toEqual({
        author: undefined,
        blogs: undefined
      })
    })
  })

  describe('author with most likes', () => {

    test('of one blog is the author of that blog', () => {
      expect(listHelper.mostLikes(listWithOneBlog)).toEqual({
        author: 'Edsger W. Dijkstra',
        likes: 5
      })
    })

    test('of many blogs is the one with most likes', () => {
      expect(listHelper.mostLikes(testHelper.initialBlogs)).toEqual({
        author: 'Edsger W. Dijkstra',
        likes: 17
      })
    })

    test('of no blogs is undefined', () => {
      expect(listHelper.mostLikes([])).toEqual({
        author: undefined,
        blogs: undefined
      })
    })
  })

})