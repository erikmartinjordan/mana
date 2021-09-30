import React                          from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
import { firebaseMockUp  }            from './_firebaseMock'
import DeletePost                     from '../Components/DeletePost'

test('Shows confirmation box to delete post/reply', async () => {

    firebaseMockUp({ message: 'whatever' })
    
    render(
        <DeletePost admin = {true}/>
    )
    
    fireEvent.click(document.querySelector('button.Delete'))
    
    await waitFor(() => expect(document.querySelector('.Confirmation').textContent).toBeTruthy())
    
})

test('Cancels deletion', async () => {
   
    firebaseMockUp({ message: 'whatever' })
    
    render(
        <DeletePost admin = {true}/>
    )
    
    fireEvent.click(document.querySelector('button.Delete'))
    
    fireEvent.click(document.querySelector('button.No-Delete'))
    
    await waitFor(() => expect(document.querySelector('.Confirmation')).toBeFalsy())
    
})