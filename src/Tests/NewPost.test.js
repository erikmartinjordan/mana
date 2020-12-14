import React                                  from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { BrowserRouter }                      from 'react-router-dom';
import NewPost                                from '../Components/NewPost';
import firebase                               from '../Functions/Firebase';
import UserContext                            from '../Functions/UserContext';
import * as GetLevel                          from '../Functions/GetLevelAndPointsToNextLevel';

test('NewPost -> Prevent users with level < 15 (free) from publishing new posts', async () => {
   
    jest.spyOn(GetLevel, 'default').mockImplementation(() => [14, '_', '_']);
    
    const userInfo = { 
        
        account: 'free'
        
    };
    
    const snapshot = { val: () => userInfo };    
    
    jest.spyOn(firebase, 'database').mockImplementation(() => ({
        
        ref:  jest.fn().mockReturnThis(),
        on:   jest.fn((event, callback) => callback(snapshot)),
        off:  jest.fn().mockReturnThis(),
        once: jest.fn(() => Promise.resolve({val: () => 0}))
        
    }));
    
    render(
        <UserContext.Provider value = {{user: true}}>
            <NewPost/>
        </UserContext.Provider>
    );
    
    fireEvent.change(screen.getByPlaceholderText('Título...'),  { target: { value: 'Some random title' } });
    fireEvent.change(screen.getByPlaceholderText('Mensaje...'), { target: { value: 'Some random message' } });
    
    fireEvent.click(document.querySelector('button.bottom'));
    
    await waitFor(() => expect(document.querySelector('.Alert .Message').textContent).toBe('Necesitas subir hasta el nivel 15 para poder publicar'));
    
});

test('NewPost -> Users with level < 15 (premium) are allowed to publish new posts', async () => {
   
    jest.spyOn(GetLevel, 'default').mockImplementation(() => [14, '_', '_']);
    
    const userInfo = { 
        
        account: 'premium'
        
    };
    
    const snapshot = { val: () => userInfo };    
    
    jest.spyOn(firebase, 'database').mockImplementation(() => ({
        
        ref:         jest.fn().mockReturnThis(),
        on:          jest.fn((event, callback) => callback(snapshot)),
        off:         jest.fn().mockReturnThis(),
        once:        jest.fn(() => Promise.resolve({val: () => 0})),
        push:        jest.fn().mockReturnThis(),
        update:      jest.fn().mockReturnThis(),
        transaction: jest.fn().mockReturnThis(),
        
    }));
    
    render(
        <UserContext.Provider value = {{user: true}}>
            <NewPost/>
        </UserContext.Provider>
    );
    
    fireEvent.change(screen.getByPlaceholderText('Título...'),  { target: { value: 'Some random title' } });
    fireEvent.change(screen.getByPlaceholderText('Mensaje...'), { target: { value: 'Some random message' } });
    
    fireEvent.click(document.querySelector('button.bottom'));
    
    await waitFor(() => expect(document.querySelector('.Alert .Message').textContent).toBe('¡Mensaje enviado!'));
    
});

test('NewPost -> Users with level >= 15 (free) are allowed to publish new posts', async () => {
   
    jest.spyOn(GetLevel, 'default').mockImplementation(() => [15, '_', '_']);
    
    const userInfo = { 
        
        account: 'free'
        
    };
    
    const snapshot = { val: () => userInfo };    
    
    jest.spyOn(firebase, 'database').mockImplementation(() => ({
        
        ref:         jest.fn().mockReturnThis(),
        on:          jest.fn((event, callback) => callback(snapshot)),
        off:         jest.fn().mockReturnThis(),
        once:        jest.fn(() => Promise.resolve({val: () => 0})),
        push:        jest.fn().mockReturnThis(),
        update:      jest.fn().mockReturnThis(),
        transaction: jest.fn().mockReturnThis()
        
    }));
    
    render(
        <UserContext.Provider value = {{user: true}}>
            <NewPost/>
        </UserContext.Provider>
    );
    
    fireEvent.change(screen.getByPlaceholderText('Título...'),  { target: { value: 'Some random title' } });
    fireEvent.change(screen.getByPlaceholderText('Mensaje...'), { target: { value: 'Some random message' } });
    
    fireEvent.click(document.querySelector('button.bottom'));
    
    await waitFor(() => expect(document.querySelector('.Alert .Message').textContent).toBe('¡Mensaje enviado!'));
    
});