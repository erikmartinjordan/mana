import React, { useState } from 'react'
import NewPost from './NewPost'

const DiscreteMenu = () => {

    const [post, setPost] = useState(false)

    return(
        <div className = 'DiscreteMenu'>
            <div style = {{ textAlign: 'right' }} onClick = {() => setPost(true)}>Publicar</div>
            { post
            ? <NewPost  hide = {() => setPost(false)}/>
            : null
            }
        </div>
    )

}

export default DiscreteMenu