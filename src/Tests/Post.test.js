import React                              from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { BrowserRouter }                  from 'react-router-dom'
import { act, Simulate }                  from 'react-dom/test-utils'
import { Content }                        from '../Components/Post'

let container = null
let description = document.createElement('meta')

beforeEach(() => {
    
    container = document.createElement("div")
    document.title = 'Test'
    description.setAttribute('name', 'description')
    description.content = 'Test'
    
    document.head.appendChild(description)
    document.body.appendChild(container)
    
})

afterEach(() => {
    
    unmountComponentAtNode(container)
    container.remove()
    container = null
    jest.clearAllMocks()
    
})

it('Post -> Content restricted for private articles & not logged users', () => {

    act(() => {
        
        render(
            <BrowserRouter>
            <Content 
                privateArticle = {true}
                user           = {null}
            />
            </BrowserRouter>
        , container)
        
    })
    
    expect(container.querySelector('button.login').textContent).toBe('Acceder')
    
})

it('Post -> Content restricted for private articles & users with level < levelLimit', () => {

    act(() => {
        
        render(
            <BrowserRouter>
            <Content 
                privateArticle = {true}
                user           = {true}
                levelLimit     = {20}
                level          = {10}
                premium        = {false}
            />
            </BrowserRouter>
        , container)
        
    })
    
    expect(container.querySelector('button.more').textContent).toBe('Saber más')
    
})

it('Post -> Content accessible for private articles & users with level >= levelLimit', () => {

    act(() => {
        
        render(
            <BrowserRouter>
            <Content 
                text           = {'Holaaaaaaaaaa'}
                privateArticle = {true}
                user           = {true}
                levelLimit     = {20}
                level          = {20}
                premium        = {false}
            />
            </BrowserRouter>
        , container)
        
    })
    
    expect(container.querySelector('.Content p').textContent).toBe('Holaaaaaaaaaa')
    
})

it('Post -> Content accessible for private articles & premium users', () => {

    act(() => {
        
        render(
            <BrowserRouter>
            <Content 
                text           = {'Holaaaaaaaaaa'}
                privateArticle = {true}
                user           = {true}
                levelLimit     = {20}
                level          = {10}
                premium        = {true}
            />
            </BrowserRouter>
        , container)
        
    })
    
    expect(container.querySelector('.Content p').textContent).toBe('Holaaaaaaaaaa')
    
})

it('Post -> Displays Login modal on click to access', () => {

    act(() => {
        
        render(
            <BrowserRouter>
            <Content 
                privateArticle = {true}
                user           = {null}
            />
            </BrowserRouter>
        , container)
        
        Simulate.click(container.querySelector('button.login'))
        
    })
    
    expect(container.querySelector('.Login')).toBeTruthy()
    
})