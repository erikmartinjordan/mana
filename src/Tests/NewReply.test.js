import React                                  from 'react'
import { BrowserRouter }                      from 'react-router-dom'
import { render, fireEvent, screen, waitFor } from '@testing-library/react'
import { firebaseMockUp }                     from './_firebaseMock'
import NewReply                               from '../Components/NewReply'
import UserContext                            from '../Functions/UserContext'
import * as GetNumberOfReplies                from '../Functions/GetNumberOfReplies'

test('NewReply -> Users with no replies get a message suggesting to read guidelines', async () => {
   
    jest.spyOn(GetNumberOfReplies, 'default').mockImplementation(() => 0)

    firebaseMockUp({ account: 'free' })
    
    render(
        <UserContext.Provider value = {{user: true}}>
            <BrowserRouter>
                <NewReply/>
            </BrowserRouter>
        </UserContext.Provider>
    )
    
    await waitFor(() => expect(document.querySelector('.NewReply .NewUser').textContent).toBe('👋 Hola, antes de publicar, échale un vistazo a las guías de publicación.'))
    
})

test('NewReply -> Users with replies do not get a message suggesting to read guidelines', async () => {
   
    jest.spyOn(GetNumberOfReplies, 'default').mockImplementation(() => 1)

    firebaseMockUp({ account: 'free' })
    
    render(
        <UserContext.Provider value = {{user: true}}>
            <BrowserRouter>
                <NewReply/>
            </BrowserRouter>
        </UserContext.Provider>
    )
    
    await waitFor(() => expect(document.querySelector('.NewReply .NewUser')).toBeNull())
    
})