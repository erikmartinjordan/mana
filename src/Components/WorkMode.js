import React, { useEffect } from 'react'

const WorkMode = ({ theme, setTheme }) => {

    useEffect(() => {

        var f

        window.addEventListener('keydown', f = (e) => {

            if((e.metaKey || e.ctrlKey) && e.key === 'd'){

                e.preventDefault()

                let _theme = theme === 'work' ? '' : 'work'

                document.documentElement.setAttribute('data-theme', _theme)

                localStorage.setItem('theme', _theme)

                setTheme(_theme)

            }

        })

        return () => window.removeEventListener('keydown', f)

    }, [theme])

    return(
        <p style = {{ fontSize: '12px', color: 'var(--secondaryFontColor)' }}>
            Activa el modo discreto <kbd>{navigator.userAgentData.platform.includes('mac') ? '⌘' : 'ctrl'}</kbd> + <kbd>D</kbd>
        </p>
    )

}

export default WorkMode