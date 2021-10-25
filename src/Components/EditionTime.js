import React  from 'react'
import moment from 'moment'

const EditionTime = ({ date }) => {

    let style = {
        color: 'var(--thirdFontColor)',
        fontSize: 'small',
        marginRight: 'auto'
    }

    return(
        <span className = 'EditionTime' style = { style }>
            {date ? ` (editado el ${moment(date).format('DD/MM/YYYY')})` : null}
        </span>
    )

}

export default EditionTime