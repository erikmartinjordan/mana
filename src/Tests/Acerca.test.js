import React                              from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { act }                            from 'react-dom/test-utils'
import Acerca                             from '../Components/Acerca'
import UserContext                        from '../Functions/UserContext'
import { onValue }                        from '../Functions/Firebase'
jest.mock("../Functions/Firebase")

let container = null
let description = document.createElement('meta')

const firebaseMockUp = () => {

    const data = { 
        
        feature: {
            
            title: "New feature",
            date: [25, 12, 2020],
            description: "Nomoresheet new cool feature",
            pic: "https://nomoresheet.es/feature.jpg"
            
        }
        
    }
    
    const snapshot = { val: () => data }

    onValue.mockImplementation((ref, callback) => {

        callback(snapshot)
    
        return jest.fn()
    
    })

}

beforeEach(() => {
    
    container = document.createElement("div")
    document.title = 'Test'
    description.setAttribute('name', 'description')
    description.content = 'Test'
    
    document.head.appendChild(description)
    document.body.appendChild(container)

    firebaseMockUp()
    
})

afterEach(() => {
    
    unmountComponentAtNode(container)
    container.remove()
    container = null
    jest.clearAllMocks()
    
})

it("Acerca -> title and description", () => {
    
    act(() => {
      
        render(
            <UserContext.Provider value = {{admin: true}}>
                <Acerca />
            </UserContext.Provider>
        , container)
      
    })
    
    expect(container.querySelector('h1').textContent).toBe('Acerca')
    expect(document.querySelector('title').textContent).toBe('Acerca - Nomoresheet')
    
})
it("Acerca -> displays admin box to write updates if admin connected", () => {
    
    act(() => {
      
        render(
            <UserContext.Provider value = {{admin: true}}>
                <Acerca />
            </UserContext.Provider>
        , container)
      
    })
    
    expect(container.querySelector('input').placeholder).toBe('Título...')
    
})
it("Acerca -> doesn't display admin box to write updates if admin not connected", () => {
    
    act(() => {
      
        render(
            <UserContext.Provider value = {{admin: false}}>
                <Acerca />
            </UserContext.Provider>
        , container)
      
    })
    
    expect(container.querySelector('input')).toBe(null)
    
})
it("Acerca -> displays feature", async () => {

    await act(async () => {
      
        render(
            <UserContext.Provider value = {{admin: false}}>
                <Acerca />
            </UserContext.Provider>
        , container)
      
    })

    expect(container.querySelector('h3').textContent).toBe('New feature')
    
})