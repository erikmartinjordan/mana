import React, { useEffect, useState } from 'react'
import { sortByObject, sortByValue }  from '../Functions/SortEntries'
import { db, onValue, ref }           from '../Functions/Firebase'
import '../Styles/SortReplies.css'

const SortReplies = ({ postId, replies, setReplies }) => {

    const [selection, setSelection] = useState('Newest')

    useEffect(() => {
        
        let unsubscribe = onValue(ref(db, `posts/${postId}/replies`), snapshot => { 

            let _replies = Object.entries(snapshot.val() || {})

            if(selection === 'Newest') _replies = (sortByValue(_replies,  'timeStamp'))
            if(selection === 'Votes')  _replies = (sortByObject(_replies, 'voteUsers'))

            setReplies(_replies)
            
        })
        
        return () => unsubscribe()
        
    }, [postId, selection])

    return(
        <div className = 'SortReplies'>
            <div className = 'NumReplies'>{replies.length} respuesta{replies.length === 1 ? '' : 's'}</div>
            { replies.length > 10
            ? <div className = 'Sort'>
                <div className = {selection === 'Newest' ? 'Selected' : null} onClick = {() => setSelection('Newest')}>Cronológico</div>
                <div className = {selection === 'Votes'  ? 'Selected' : null} onClick = {() => setSelection('Votes')}>Votos</div>
              </div>
            : null
            }
        </div>
    )

}

export default SortReplies