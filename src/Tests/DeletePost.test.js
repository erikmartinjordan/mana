import React                                  from 'react';
import { BrowserRouter }                      from 'react-router-dom';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import firebase                               from '../Functions/Firebase';
import DeletePost                             from '../Functions/DeletePost';

test('Shows confirmation box to delete post/reply', async () => {
    
    const userInfo = { 
        
        message: 'whatever'
        
    };
    
    const snapshot = { val: () => userInfo }; 
        
    jest.spyOn(firebase, 'database').mockImplementation(() => ({
        
        ref:  jest.fn().mockReturnThis(),
        on:   jest.fn((event, callback) => callback(snapshot)),
        once: jest.fn(() => Promise.resolve({val: () => 0})),
        off:  jest.fn()
         
    }));
    
    render(
        <DeletePost admin = {true}/>
    );
    
    fireEvent.click(document.querySelector('button.Delete'));
    
    await waitFor(() => expect(document.querySelector('.Confirmation').textContent).toBeTruthy());
    
});

test('Cancels deletion', async () => {
   
    const userInfo = { 
        
        message: 'whatever'
        
    };
    
    const snapshot = { val: () => userInfo }; 
        
    jest.spyOn(firebase, 'database').mockImplementation(() => ({
        
        ref:  jest.fn().mockReturnThis(),
        on:   jest.fn((event, callback) => callback(snapshot)),
        once: jest.fn(() => Promise.resolve({val: () => 0})),
        off:  jest.fn()
         
    }));
    
    render(
        <DeletePost admin = {true}/>
    );
    
    fireEvent.click(document.querySelector('button.Delete'));
    
    fireEvent.click(document.querySelector('button.No-Delete'));
    
    await waitFor(() => expect(document.querySelector('.Confirmation')).toBeFalsy());
    
});