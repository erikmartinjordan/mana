import React, { useEffect, useState } from 'react';
import { Link }                       from 'react-router-dom';
import firebase                       from '../Functions/Firebase';
import '../Styles/Participants.css';

const Participants = () => {

    const [participants, setParticipants] = useState([]);
    const postId = window.location.pathname.split('/').find(e => e.startsWith('-'));

    useEffect(() => {

        let ref = firebase.database().ref(`posts/${postId}`);

        let listener = ref.on('value', snapshot => {

            let post = snapshot.val();

            if(post){

                let unique = {};

                unique[post.userUid] = {};
                unique[post.userUid]['name'] = post.userName;
                unique[post.userUid]['pic']  = post.userPhoto;
                unique[post.userUid]['uid']  = post.userUid;

                if(post.replies){
    
                    Object.values(post.replies).forEach(reply => {
    
                        unique[reply.userUid] = {};
                        unique[reply.userUid]['name'] = reply.userName;
                        unique[reply.userUid]['pic']  = reply.userPhoto;
                        unique[reply.userUid]['uid']  = reply.userUid;
    
                    });
    
                }

                setParticipants(Object.entries(unique));

            }

        });

        return () => ref.off('value', listener);

    }, [postId]);

    return(
        <React.Fragment>
            <div className = 'Participants'>
                <span className = 'Title'> {participants.length} Participante{participants.length === 1 ? null : 's'}</span>
                <div className = 'Participants-Wrap'>
                    {participants.slice(0, 7).map(([uid, participant]) => 
                        <div className = 'Participant' key = {uid}>   
                            <Link to = {`/@${uid}`}>
                                <img src = {participant.pic}></img>
                            </Link>
                        </div>
                    )}
                    <span className = 'More'>{participants.length > 7 ? `y ${participants.length - 7} más` : null}</span>
                </div>
            </div>
        </React.Fragment>
    );

}

export default Participants;