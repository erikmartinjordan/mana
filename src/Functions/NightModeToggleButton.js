import React, { useState, useEffect } from 'react';
import ToggleButton                   from './ToggleButton';

const NightModeToggleButton = () => {
    
    const [theme, setTheme] = useState('');
    
    useEffect( () => {
        
        var local;
        
        local = localStorage.getItem('theme');
        
        local === 'dark' 
        ? document.documentElement.setAttribute('data-theme','dark') 
        : document.documentElement.setAttribute('data-theme','');
        
        setTheme(local);   
        
    }, []);
    
    const changeTheme = () => {
        
        theme === 'dark' 
        ? document.documentElement.setAttribute('data-theme','') 
        : document.documentElement.setAttribute('data-theme','dark');
        
        theme === 'dark' 
        ? localStorage.setItem('theme', '') 
        : localStorage.setItem('theme', 'dark');
        
        theme === 'dark'
        ? setTheme('')
        : setTheme('dark');
    }
    
    return  (
        <div className = 'Toggle-Button' onClick = {() => changeTheme()} style = {{width: 'max-content'}}>
            <ToggleButton status = {theme === 'dark' ? 'on' : 'off'}  icon = {theme === 'dark' ? '🌙' : '🌞'}/> 
        </div>
    );
    
}

export default NightModeToggleButton;