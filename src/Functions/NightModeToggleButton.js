import React, { useState, useEffect } from 'react';
import ToggleButton from './ToggleButton.js';

//--------------------------------------------------------------/
//
//
// This functions returns the toggle button triggering
// night mode.
//
//
//--------------------------------------------------------------/
const NightModeToggleButton = () => {
    
    const [theme, setTheme] = useState('');
    
    useEffect( () => {
        // Declaring variable
        var local;

        // Getting current theme from local storage
        local = localStorage.getItem('theme');

        // Setting the theme
        local === 'dark' 
        ? document.documentElement.setAttribute('data-theme','dark') 
        : document.documentElement.setAttribute('data-theme','');

        // Setting the state
        setTheme(local);   
        
    });
    
    const changeTheme = () => {
        
        // Is dark theme activated?
        theme === 'dark' 
        ? document.documentElement.setAttribute('data-theme','') 
        : document.documentElement.setAttribute('data-theme','dark');

        // New theme
        theme === 'dark' 
        ? localStorage.setItem('theme', '') 
        : localStorage.setItem('theme', 'dark');

        // Setting the theme
        theme === 'dark'
        ? setTheme('')
        : setTheme('dark');
    }
    
    return  <div className = 'Toggle-Button' onClick = {() => changeTheme()} >
                {theme === 'dark' 
                ? <ToggleButton status = 'on'/> 
                : <ToggleButton status = 'off'/>
                }
            </div>
    
}

export default NightModeToggleButton;