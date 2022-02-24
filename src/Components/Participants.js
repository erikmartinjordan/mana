import React, { useEffect, useState } from 'react'
import { Link }                       from 'react-router-dom'
import { db, onValue, ref }           from '../Functions/Firebase'
import '../Styles/Participants.css'

const Participants = () => {

    const [participants, setParticipants] = useState([])
    const postId = window.location.pathname.split('/').find(e => e.startsWith('-'))

    useEffect(() => {

        let unsubscribe = onValue(ref(db, `posts/${postId}`), snapshot => {

            let post = snapshot.val()

            if(post){

                let unique = {}

                unique[post.userUid] = {}
                unique[post.userUid]['name'] = post.userName
                unique[post.userUid]['pic']  = post.userPhoto
                unique[post.userUid]['uid']  = post.userUid

                if(post.replies){
    
                    Object.values(post.replies).forEach(reply => {
    
                        unique[reply.userUid] = {}
                        unique[reply.userUid]['name'] = reply.userName
                        unique[reply.userUid]['pic']  = reply.userPhoto
                        unique[reply.userUid]['uid']  = reply.userUid
    
                    })
    
                }

                setParticipants(Object.entries(unique))

            }

        })

        return () => unsubscribe()

    }, [postId])

    return(
        <div className = 'Participants'>
            <span className = 'Title'> {participants.length} Participante{participants.length === 1 ? null : 's'}</span>
            <div className = 'Participants-Wrap'>
                { participants.slice(0, 7).map(([uid, participant]) => 
                    <Link to = {`/@${uid}`} key = {uid}>
                        <div className = 'UserAvatar'>
                            <img src = {participant.pic}/>
                        </div>
                    </Link>
                )}
                <span className = 'More'>{participants.length > 7 ? `y ${participants.length - 7} más` : null}</span>
            </div>
        </div>
    )

}

export default Participants