import React                                  from 'react'
import { render, fireEvent, screen, waitFor } from '@testing-library/react'
import NewPost                                from '../Components/NewPost'
import UserContext                            from '../Functions/UserContext'
import * as GetLevel                          from '../Functions/GetLevelAndPointsToNextLevel'
import { onValue }                            from '../Functions/Firebase'
jest.mock("../Functions/Firebase")

test('NewPost -> Prevent users with level < 15 (free) from publishing new posts', async () => {
   
    jest.spyOn(GetLevel, 'default').mockImplementation(() => [14, '_', '_'])

    const userInfo = { 
        
        account: 'free'
        
    }
    
    const snapshot = { val: () => data }

    onValue.mockImplementation((ref, callback) => {

        callback(snapshot)
    
        return jest.fn()
    
    })
    
    render(
        <UserContext.Provider value = {{user: true}}>
            <NewPost/>
        </UserContext.Provider>
    )
    
    fireEvent.change(screen.getByPlaceholderText('Título...'),  { target: { value: 'Some random title' } })
    fireEvent.change(screen.getByPlaceholderText('Mensaje...'), { target: { value: 'Some random message' } })
    
    fireEvent.click(document.querySelector('button.bottom'))
    
    await waitFor(() => expect(document.querySelector('.Alert .Message').textContent).toBe('Necesitas subir hasta el nivel 15 para poder publicar'))
    
})

test('NewPost -> Users with level < 15 (premium) are allowed to publish new posts', async () => {
   
    jest.spyOn(GetLevel, 'default').mockImplementation(() => [14, '_', '_'])
    
    const userInfo = { 
        
        account: 'premium'
        
    }
    
    const snapshot = { val: () => data }

    onValue.mockImplementation((ref, callback) => {

        callback(snapshot)
    
        return jest.fn()
    
    })
    
    render(
        <UserContext.Provider value = {{user: true}}>
            <NewPost/>
        </UserContext.Provider>
    )
    
    fireEvent.change(screen.getByPlaceholderText('Título...'),  { target: { value: 'Some random title' } })
    fireEvent.change(screen.getByPlaceholderText('Mensaje...'), { target: { value: 'Some random message' } })
    
    fireEvent.click(document.querySelector('button.bottom'))
    
    await waitFor(() => expect(document.querySelector('.Alert .Message').textContent).toBe('¡Mensaje enviado!'))
    
})

test('NewPost -> Users with level >= 15 (free) are allowed to publish new posts', async () => {
   
    jest.spyOn(GetLevel, 'default').mockImplementation(() => [15, '_', '_'])

    const userInfo = { 
        
        account: 'free'
        
    }
    
    const snapshot = { val: () => data }

    onValue.mockImplementation((ref, callback) => {

        callback(snapshot)
    
        return jest.fn()
    
    })
    
    render(
        <UserContext.Provider value = {{user: true}}>
            <NewPost/>
        </UserContext.Provider>
    )
    
    fireEvent.change(screen.getByPlaceholderText('Título...'),  { target: { value: 'Some random title' } })
    fireEvent.change(screen.getByPlaceholderText('Mensaje...'), { target: { value: 'Some random message' } })
    
    fireEvent.click(document.querySelector('button.bottom'))
    
    await waitFor(() => expect(document.querySelector('.Alert .Message').textContent).toBe('¡Mensaje enviado!'))
    
})