import React from 'react'
import { shallow } from 'enzyme'
import Blog from './Blog'

const blog = {
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

describe('<Blog /> toggled for short and full information', () => {

  let blogComponent

  beforeEach(() => {
    blogComponent = shallow(<Blog blog={ blog } />)
  })

  it('at first short information is displayed', () => {
    const fullDiv = blogComponent.find('.fullView')
    expect(fullDiv.getElement().props.style).toEqual({ display: 'none' })
  })

  it('after clicking, full information is displayed', () => {
    const titleDiv = blogComponent.find('.title')
    titleDiv.simulate('click')
    const fullDiv = blogComponent.find('.fullView')
    expect(fullDiv.getElement().props.style).toEqual({ display: '' })
  })
})