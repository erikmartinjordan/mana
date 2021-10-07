import React, { useState, useEffect } from 'react'
import ToggleButton                   from './ToggleButton'
import WorkMode                       from './WorkMode'
import { SunIcon, MoonIcon }          from '@primer/octicons-react'

const NightModeToggleButton = () => {
    
    const [theme, setTheme] = useState('')
    
    useEffect(() => {
        
        let _theme = localStorage.getItem('theme')

        if(_theme === null){
            
            let hour = (new Date()).getHours()

            _theme = hour > 7 && hour <= 19 ? '' : 'dark'

        }

        document.documentElement.setAttribute('data-theme', _theme)

        setTheme(_theme)
        
    }, [])
    
    const changeTheme = () => {

        let _theme = theme === 'dark' ? '' : 'dark'

        document.documentElement.setAttribute('data-theme', _theme)
        
        localStorage.setItem('theme', _theme)

        setTheme(_theme)

    }
    
    return  (
        <div className = 'Toggle-Button' onClick = {changeTheme} style = {{width: 'max-content'}}>
            <ToggleButton status = {theme === 'dark' ? 'on' : 'off'}  icon = {theme === 'dark' ? <MoonIcon/> : <SunIcon/>}/> 
            <WorkMode theme = {theme} setTheme = {setTheme}/>
        </div>
    )
    
}

export default NightModeToggleButton