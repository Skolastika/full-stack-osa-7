let token = null

const blogs = [
  {
    _id: '5be35ebe80a6fd3cecb3fc6e',
    title: 'The Wordpress.com Blog',
    author: 'Wordpress',
    url: 'https://en.blog.wordpress.com/',
    likes: 0,
    user: {
      _id: '5be1b69c82e4d242a8c10b83',
      username: 'nunnu',
      name: 'Nunnu'
    }
  },
  {
    _id: '5be475ef2ab6884cb4c30fa3',
    title: 'The Wordpress.com Blog 2',
    author: 'Wordpress',
    url: 'https://en.blog.wordpress.com/',
    likes: 0,
    user: {
      _id: '5be1b69c82e4d242a8c10b83',
      username: 'nunnu',
      name: 'Nunnu'
    }
  },
  {
    _id: '5be6d83791dbc70fa0606db7',
    title: 'Nunnun blogi',
    author: 'Nunnu',
    url: 'http://www.nunnu.com',
    likes: 0,
    user: {
      _id: '5be1b69c82e4d242a8c10b83',
      username: 'nunnu',
      name: 'Nunnu'
    }
  },
  {
    _id: '5be6dbdd91dbc70fa0606db8',
    title: 'Nunnun blogi',
    author: '',
    url: '',
    likes: 0,
    user: {
      _id: '5be1b69c82e4d242a8c10b83',
      username: 'nunnu',
      name: 'Nunnu'
    }
  },
  {
    _id: '5be6df4491dbc70fa0606db9',
    title: 'Nunnun blogi 2',
    author: 'Nunnu',
    url: 'http://www.nunnu.com',
    likes: 0,
    user: {
      _id: '5be1b69c82e4d242a8c10b83',
      username: 'nunnu',
      name: 'Nunnu'
    }
  },
  {
    _id: '5be6e27c91dbc70fa0606dba',
    title: 'Nunnun blogi 3',
    author: 'Nunnu',
    url: 'http://www.nunnu.com',
    likes: 0,
    user: {
      _id: '5be1b69c82e4d242a8c10b83',
      username: 'nunnu',
      name: 'Nunnu'
    }
  }
]

const getAll = () => {
  return Promise.resolve(blogs)
}

export default { getAll, blogs }