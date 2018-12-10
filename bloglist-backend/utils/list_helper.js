const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => {
    return sum + blog.likes
  }, 0)
}

const favoriteBlog = (blogs) => {
  const favorite =  blogs.reduce((favorite, blog) => {
    return favorite.likes >= blog.likes ? favorite : blog
  }, {})

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes
  }
}

const mostBlogs = (blogs) => {
  const blogCounts = blogs.reduce((counts, blog) => {
    var count = counts.find((blogCount) => blogCount.author === blog.author)
    if (count) {
      count.blogs += 1
    }
    else {
      counts.push({
        author: blog.author,
        blogs: 1
      })
    }
    return counts
  }, [])
  return blogCounts.reduce((mostCounts, count) => {
    return mostCounts.blogs >= count.blogs ? mostCounts : count
  }, {})
}

const mostLikes = (blogs) => {
  const likeCounts = blogs.reduce((likes, blog) => {
    var count = likes.find((likeCount) => likeCount.author === blog.author)
    if (count) {
      count.likes += blog.likes
    }
    else {
      likes.push({
        author: blog.author,
        likes: blog.likes
      })
    }
    return likes
  }, [])
  return likeCounts.reduce((mostLiked, count) => {
    return mostLiked.likes >= count.likes ? mostLiked : count
  }, {})
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}