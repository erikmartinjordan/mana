import React    from 'react'
import Linkify  from 'react-linkify'

const Highlight = ({ text }) => {

    const mentions = {

        background: 'var(--lightBlue)',
        borderRadius: '6px',
        color: 'var(--blue)',
        padding: '3px'

    }

    let res = text.map(paragraph => {

        let aux = ['']

        if(typeof paragraph === 'string'){
    
            let arr = paragraph.split(' ')
    
            arr.forEach((el, i) => {
                
                if(el.startsWith('@')){

                    const separators = new RegExp(/(\.|\,|\:|\;)/)
                    aux = [...aux, <span key = {i} style = {mentions}>{el.split(separators)[0]}</span>, (el.split(separators)[1] || '') + ' ']

                }
                else
                    aux[aux.length - 1] += (i !== arr.length - 1) ? el + ' ' : el
            
            })
        }
        else{
    
            aux = paragraph
    
        }

        return aux

    });

    return(
        <Linkify properties = {{ target: '_blank', rel: 'nofollow noopener noreferrer' }}>
            <p>{res}</p>
        </Linkify>
    );

}

export default Highlight