import React, { useState, useEffect }  from 'react';
import Question                        from './Question';
import Replies                         from './Replies';
import Norms                           from './Norms';
import Comments                        from './Comments';
import NewReply                        from './NewReply';
import firebase, { auth }              from '../Functions/Firebase';
import '../Styles/Forum.css';

const Detail = (props) => {
    
    const [admin, setAdmin] = useState(false);
    const [title, setTitle] = useState(null);
    
    useEffect( () => {
        
        auth.onAuthStateChanged( (user) => {
            
            if(user){
                
                let admin = (user.uid === 'dOjpU9i6kRRhCLfYb6sfSHhvdBx2') ? true : false;
                
                setAdmin(admin);
            }
            
        });
        
    }, []);
    
    return (
        <div className = 'Forum Detail'>
            <h2>{title}</h2>
            <div className = 'Forum-TwoCol'>
                <div className = 'Main'>
                    <Question postId = {props.match.params.string} admin = {admin} setTitle = {setTitle}/>
                    <Replies  postId = {props.match.params.string} admin = {admin}/>
                    <NewReply postId = {props.match.params.string}/>
                </div>
                <div className = 'Sidebar'>
                    <Norms/>
                    <Comments/>
                </div>
            </div>
      </div>    
    );
}

export default Detail;
