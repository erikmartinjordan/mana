import React  from 'react'
import moment from 'moment'

const EditionTime = ({ date }) => {

    let style = {
        color: 'var(--thirdFontColor)',
        fontSize: 'small',
        marginRight: 'auto'
    }

    return(
        <div className = 'EditionTime' style = { style }>
            {date ? `Editado el ${moment(date).format('DD/MM/YYYY [a las] hh:mm')}` : null}
        </div>
    )

}

export default EditionTime