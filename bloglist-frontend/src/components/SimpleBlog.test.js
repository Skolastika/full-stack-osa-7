import React from 'react'
import { shallow } from 'enzyme'
import SimpleBlog from './SimpleBlog'

const blog = {
  title: 'Blog Title',
  author: 'Blog Author',
  likes: 2
}

describe('<SimpleBlog />', () => {

  it('renders title, author, and likes', () => {
    const blogComponent = shallow(<SimpleBlog blog={ blog } />)
    const titleAndAuthorDiv = blogComponent.find('.titleAndAuthor')
    const likesDiv = blogComponent.find('.likes')

    expect(titleAndAuthorDiv.text()).toContain(blog.title)
    expect(titleAndAuthorDiv.text()).toContain(blog.author)
    expect(likesDiv.text()).toContain(blog.likes)
  })

  it('clicking likes button twice calls event handler twice', () => {
    const mockHandler = jest.fn()
    const blogComponent = shallow(<SimpleBlog blog={ blog } onClick={ mockHandler } />)
    const button = blogComponent.find('button')

    button.simulate('click')
    button.simulate('click')

    expect(mockHandler.mock.calls.length).toBe(2)
  })
})