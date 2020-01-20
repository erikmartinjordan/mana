import React, { useState, useEffect }      from 'react';
import Question                            from './Question';
import Replies                             from './Replies';
import Norms                               from './Norms';
import Comments                            from './Comments';
import NewReply                            from './NewReply';
import Default                             from './Default';
import firebase, { auth, fetchAdmin }      from '../Functions/Firebase';
import '../Styles/Forum.css';

const Detail = (props) => {
    
    const [admin, setAdmin]         = useState(false);
    const [validPost, setValidPost] = useState(true);
    const [title, setTitle]         = useState(null);
    
    auth.onAuthStateChanged( async user => {

        if(user){
            
            let admin = await fetchAdmin(user);
            
            setAdmin(admin);
        }
        else{
            setAdmin(false);
        }
        
    });
    
    useEffect( () => {
        
        const fetchPost = async () => {
            
            let snapshot = await firebase.database().ref(`posts/${props.match.params.string}`).once('value');
            
            let capture  = snapshot.val();
            
            capture
            ? firebase.database().ref(`posts/${props.match.params.string}/views`).transaction( value =>  value + 1 )
            : setValidPost(false);
            
        }
        
        fetchPost();
        
    }, []);
        
    return (
        <React.Fragment>
            {validPost
            ? <div className = 'Forum Detail'>
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
            : <Default/>
            }
        </React.Fragment> 
    );
}

export default Detail;