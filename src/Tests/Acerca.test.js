import React                              from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act }                            from 'react-dom/test-utils';
import UserContext                        from '../Functions/UserContext';
import firebase                           from '../Functions/Firebase';
import Acerca                             from '../Components/Acerca';

let container = null;
let description = document.createElement('meta');

beforeEach(() => {
    
    container = document.createElement("div");
    document.title = 'Test';
    description.setAttribute('name', 'description');
    description.content = 'Test';
    
    document.head.appendChild(description);
    document.body.appendChild(container);
    
});

afterEach(() => {
    
    unmountComponentAtNode(container);
    container.remove();
    container = null;
    jest.clearAllMocks();
    
});

it("Acerca -> title and description", () => {
    
    act(() => {
      
        render(
            <UserContext.Provider value = {{admin: true}}>
                <Acerca />
            </UserContext.Provider>
        , container);
      
    });
    
    expect(container.querySelector('h1').textContent).toBe('Acerca');
    expect(document.querySelector('title').textContent).toBe('Acerca - Nomoresheet');
    
});
it("Acerca -> displays admin box to write updates if admin connected", () => {
    
    act(() => {
      
        render(
            <UserContext.Provider value = {{admin: true}}>
                <Acerca />
            </UserContext.Provider>
        , container);
      
    });
    
    expect(container.querySelector('input').placeholder).toBe('Título...');
    
});
it("Acerca -> doesn't display admin box to write updates if admin not connected", () => {
    
    act(() => {
      
        render(
            <UserContext.Provider value = {{admin: false}}>
                <Acerca />
            </UserContext.Provider>
        , container);
      
    });
    
    expect(container.querySelector('input')).toBe(null);
    
});
it("Acerca -> displays feature", async () => {
    
    const data = { 
        
        feature: {
            
            title: "New feature",
            date: [25, 12, 2020],
            description: "Nomoresheet new cool feature",
            pic: "https://nomoresheet.es/feature.jpg"
            
        }
        
    };
    
    const snapshot = { val: () => data };    
    
    jest.spyOn(firebase, 'database').mockImplementation(() => ({
        
        ref: jest.fn().mockReturnThis(),
        on:  jest.fn((event, callback) => callback(snapshot)),
        off: jest.fn().mockReturnThis()
        
    }));
    
    await act(async () => {
      
        render(
            <UserContext.Provider value = {{admin: false}}>
                <Acerca />
            </UserContext.Provider>
        , container);
      
    });
    
    expect(container.querySelector('h3').textContent).toBe(data.feature.title);
    
});